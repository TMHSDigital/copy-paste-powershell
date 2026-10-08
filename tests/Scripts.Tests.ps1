#Requires -Modules @{ ModuleName = 'Pester'; ModuleVersion = '5.0' }

BeforeAll {
    $script:RepoRoot = Split-Path -Parent $PSScriptRoot
    $script:ScriptsDir = Join-Path $RepoRoot 'scripts'

    function Get-ScriptPath([string]$Name) {
        Join-Path $ScriptsDir "$Name\$Name.ps1"
    }

    function New-Sandbox {
        $dir = Join-Path $TestDrive ([guid]::NewGuid().ToString('n'))
        New-Item -ItemType Directory -Path $dir | Out-Null
        $dir
    }
}

Describe 'Script folder layout' {
    $folders = Get-ChildItem -LiteralPath (Join-Path (Split-Path -Parent $PSScriptRoot) 'scripts') -Directory
    It '<_.Name> has exactly one .ps1 and an index.md' -ForEach $folders {
        @(Get-ChildItem -LiteralPath $_.FullName -Filter *.ps1).Count | Should -Be 1
        Join-Path $_.FullName 'index.md' | Should -Exist
    }

    It '<_.Name> documents exactly the parameters in its param() block' -ForEach $folders {
        $ps1 = Get-ChildItem -LiteralPath $_.FullName -Filter *.ps1 | Select-Object -First 1
        $ast = [System.Management.Automation.Language.Parser]::ParseFile($ps1.FullName, [ref]$null, [ref]$null)
        $declared = @($ast.ParamBlock.Parameters | ForEach-Object { $_.Name.VariablePath.UserPath }) | Sort-Object

        $index = Get-Content -LiteralPath (Join-Path $_.FullName 'index.md') -Raw
        $front = ($index -split '(?m)^---\s*$')[1]
        $documented = @([regex]::Matches($front, '(?m)^\s*-\s*name:\s*(\S+)') | ForEach-Object { $_.Groups[1].Value }) | Sort-Object

        ($documented -join ',') | Should -Be ($declared -join ',')
    }
}

Describe 'backup-folder.ps1' {
    It 'copies a folder into a timestamped child of DestinationRoot' {
        $box = New-Sandbox
        New-Item -ItemType Directory -Path "$box\docs" | Out-Null
        Set-Content -LiteralPath "$box\docs\a.txt" -Value 'a'
        $dest = & (Get-ScriptPath 'backup-folder') -Source "$box\docs" -DestinationRoot "$box\backups"
        $dest | Should -Match 'docs-\d{8}-\d{6}$'
        Join-Path $dest 'a.txt' | Should -Exist
    }

    It 'names the backup after the folder when Source is "."' {
        $box = New-Sandbox
        New-Item -ItemType Directory -Path "$box\proj" | Out-Null
        Push-Location "$box\proj"
        try {
            $dest = & (Get-ScriptPath 'backup-folder') -Source . -DestinationRoot "$box\backups"
        } finally {
            Pop-Location
        }
        Split-Path -Leaf $dest | Should -Match '^proj-\d{8}-\d{6}$'
    }

    It 'refuses a destination inside the source and creates nothing' {
        $box = New-Sandbox
        { & (Get-ScriptPath 'backup-folder') -Source $box -DestinationRoot "$box\backups" } | Should -Throw '*inside Source*'
        "$box\backups" | Should -Not -Exist
    }

    It 'changes nothing with -WhatIf' {
        $box = New-Sandbox
        New-Item -ItemType Directory -Path "$box\docs" | Out-Null
        & (Get-ScriptPath 'backup-folder') -Source "$box\docs" -DestinationRoot "$box\backups" -WhatIf
        "$box\backups" | Should -Not -Exist
    }
}

Describe 'rename-files.ps1' {
    BeforeEach {
        $box = New-Sandbox
        'a', 'b', 'x-a' | ForEach-Object { Set-Content -LiteralPath "$box\$_.md" -Value $_ }
    }

    It 'previews without renaming and flags the conflict' {
        $plan = & (Get-ScriptPath 'rename-files') -Path $box -Prefix 'x-' -Filter *.md 3>$null
        ($plan | Where-Object Status -like 'Conflict*').FullName | Should -Be (Join-Path $box 'a.md')
        ($plan | Where-Object Status -like 'Skip*').FullName | Should -Be (Join-Path $box 'x-a.md')
        (Get-ChildItem $box).Name | Sort-Object | Should -Be @('a.md', 'b.md', 'x-a.md')
    }

    It 'skips the conflict and still renames the rest with -Apply' {
        $summary = & (Get-ScriptPath 'rename-files') -Path $box -Prefix 'x-' -Filter *.md -Apply
        (Get-ChildItem $box).Name | Sort-Object | Should -Be @('a.md', 'x-a.md', 'x-b.md')
        $summary | Should -Be 'Renamed 1, skipped 1, conflicts 1, failed 0.'
    }

    It 'is a no-op the second time' {
        & (Get-ScriptPath 'rename-files') -Path $box -Prefix 'x-' -Filter *.md -Apply | Out-Null
        $summary = & (Get-ScriptPath 'rename-files') -Path $box -Prefix 'x-' -Filter *.md -Apply
        $summary | Should -Match '^Renamed 0,'
        (Get-ChildItem $box).Name | Sort-Object | Should -Be @('a.md', 'x-a.md', 'x-b.md')
    }

    It 'changes nothing with -Apply -WhatIf' {
        & (Get-ScriptPath 'rename-files') -Path $box -Prefix 'x-' -Filter *.md -Apply -WhatIf | Out-Null
        (Get-ChildItem $box).Name | Sort-Object | Should -Be @('a.md', 'b.md', 'x-a.md')
    }
}

Describe 'remove-old-files.ps1' {
    BeforeEach {
        $box = New-Sandbox
        Set-Content -LiteralPath "$box\old.log" -Value 'old'
        Set-Content -LiteralPath "$box\new.log" -Value 'new'
        (Get-Item "$box\old.log").LastWriteTime = (Get-Date).AddDays(-40)
    }

    It 'previews by default' {
        $rows = & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 3>$null
        @($rows).Count | Should -Be 1
        "$box\old.log" | Should -Exist
    }

    It 'deletes only old files with -Apply' {
        & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Apply
        "$box\old.log" | Should -Not -Exist
        "$box\new.log" | Should -Exist
    }

    It 'changes nothing with -Apply -WhatIf' {
        & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Apply -WhatIf
        "$box\old.log" | Should -Exist
    }

    It 'matches the real name, not the 8.3 short name (*.htm must not match .html)' {
        'page.html', 'app.logold' | ForEach-Object {
            Set-Content -LiteralPath "$box\$_" -Value 'x'
            (Get-Item -LiteralPath "$box\$_").LastWriteTime = (Get-Date).AddDays(-40)
        }
        & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Filter *.htm -Apply | Out-Null
        & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Filter *.log -Apply | Out-Null
        "$box\page.html" | Should -Exist
        "$box\app.logold" | Should -Exist
        "$box\old.log" | Should -Not -Exist
    }

    It 'treats brackets in -Filter literally' {
        Set-Content -LiteralPath "$box\a[1].log" -Value 'x'
        (Get-Item -LiteralPath "$box\a[1].log").LastWriteTime = (Get-Date).AddDays(-40)
        & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Filter 'a[1].log' -Apply | Out-Null
        "$box\a[1].log" | Should -Not -Exist
        "$box\old.log" | Should -Exist
    }

    It 'keeps going past a file it cannot delete and reports the counts' {
        'b', 'c' | ForEach-Object {
            Set-Content -LiteralPath "$box\$_.log" -Value 'x'
            (Get-Item -LiteralPath "$box\$_.log").LastWriteTime = (Get-Date).AddDays(-40)
        }
        (Get-Item -LiteralPath "$box\old.log").IsReadOnly = $true
        $summary = & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Apply 3>$null
        $summary | Should -Be 'Removed 2, failed 1.'
        "$box\old.log" | Should -Exist
        "$box\b.log" | Should -Not -Exist
        "$box\c.log" | Should -Not -Exist
    }

    It 'deletes read-only files with -Force' {
        (Get-Item -LiteralPath "$box\old.log").IsReadOnly = $true
        $summary = & (Get-ScriptPath 'remove-old-files') -Path $box -OlderThanDays 30 -Apply -Force
        $summary | Should -Be 'Removed 1, failed 0.'
        "$box\old.log" | Should -Not -Exist
    }
}

Describe 'folder-inventory.ps1' {
    It 'writes a CSV that keeps non-ASCII file names' {
        $box = New-Sandbox
        New-Item -ItemType Directory -Path "$box\docs" | Out-Null
        $name = "caf$([char]0x00E9).txt"
        Set-Content -LiteralPath (Join-Path "$box\docs" $name) -Value 'x'
        & (Get-ScriptPath 'folder-inventory') -Path "$box\docs" -OutputPath "$box\files.csv" | Out-Null
        $bytes = [System.IO.File]::ReadAllBytes("$box\files.csv")
        $bytes[0..2] | Should -Be @(0xEF, 0xBB, 0xBF)
        [System.IO.File]::ReadAllText("$box\files.csv", [System.Text.Encoding]::UTF8) | Should -Match ([regex]::Escape($name))
    }

    It 'writes nothing with -WhatIf' {
        $box = New-Sandbox
        & (Get-ScriptPath 'folder-inventory') -Path $box -OutputPath "$box\files.csv" -WhatIf
        "$box\files.csv" | Should -Not -Exist
    }
}

Describe 'find-large-files.ps1' {
    It 'lists files at or above the threshold' {
        $box = New-Sandbox
        Set-Content -LiteralPath "$box\small.txt" -Value 'x'
        $rows = & (Get-ScriptPath 'find-large-files') -Path $box -MinimumSizeMB 0
        @($rows).Count | Should -Be 1
        $rows.FullName | Should -Be (Join-Path $box 'small.txt')
    }
}

Describe 'start-logged-transcript.ps1' {
    It 'explains instead of throwing when no transcript is running' {
        $warnings = & (Get-ScriptPath 'start-logged-transcript') -Stop 3>&1
        "$warnings" | Should -Match 'No transcript is running'
    }
}

Describe 'test-hosts.ps1' {
    It 'skips comments and blank lines and returns one row per host' {
        $box = New-Sandbox
        Set-Content -LiteralPath "$box\hosts.txt" -Value @('# comment', '', 'localhost')
        $rows = & (Get-ScriptPath 'test-hosts') -HostsPath "$box\hosts.txt" -Port 1 -TimeoutMs 200
        @($rows).Count | Should -Be 1
        $rows.Host | Should -Be 'localhost'
        $rows.PSObject.Properties.Name | Should -Contain 'LatencyMs'
    }
}

Describe 'export-installed-programs.ps1' -Skip:(-not $IsWindows -and $PSVersionTable.PSVersion.Major -ge 6) {
    It 'writes a UTF-8 CSV with a BOM' {
        $box = New-Sandbox
        & (Get-ScriptPath 'export-installed-programs') -OutputPath "$box\p.csv" | Out-Null
        $bytes = [System.IO.File]::ReadAllBytes("$box\p.csv")
        $bytes[0..2] | Should -Be @(0xEF, 0xBB, 0xBF)
    }
}
