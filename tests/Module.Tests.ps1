#Requires -Modules @{ ModuleName = 'Pester'; ModuleVersion = '5.0' }

# Tests the module in module/CopyPastePowerShell, or a packaged copy when
# CPP_MODULE_DIR points at one (the release workflow sets it).

BeforeAll {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    & node (Join-Path $repoRoot 'tools/build-module.mjs') | Out-Null
    $script:moduleDir = if ($env:CPP_MODULE_DIR) { $env:CPP_MODULE_DIR } else { Join-Path $repoRoot 'module/CopyPastePowerShell' }
    $script:manifest = Join-Path $moduleDir 'CopyPastePowerShell.psd1'
    Import-Module $manifest -Force
}

AfterAll {
    Remove-Module CopyPastePowerShell -ErrorAction SilentlyContinue
}

Describe 'CopyPastePowerShell module' {
    It 'has a valid manifest' {
        $info = Test-ModuleManifest -Path $manifest
        $info.Name | Should -Be 'CopyPastePowerShell'
    }

    It 'exports exactly the functions listed in the manifest' {
        $exported = (Get-Command -Module CopyPastePowerShell).Name | Sort-Object
        $listed = (Test-ModuleManifest -Path $manifest).ExportedFunctions.Keys | Sort-Object
        ($exported -join ',') | Should -Be ($listed -join ',')
    }

    It 'wraps every script in scripts/' {
        $folders = @(Get-ChildItem -LiteralPath (Join-Path (Split-Path -Parent $PSScriptRoot) 'scripts') -Directory).Count
        # One function per script, plus Find-Snippet.
        @(Get-Command -Module CopyPastePowerShell).Count | Should -Be ($folders + 1)
    }

    It 'keeps comment-based help and -WhatIf on wrapped scripts' {
        (Get-Help Backup-Folder).Synopsis | Should -Match 'timestamped'
        (Get-Command Backup-Folder).Parameters.Keys | Should -Contain 'WhatIf'
    }

    It 'runs a wrapped script' {
        $dir = Join-Path $TestDrive 'mod'
        New-Item -ItemType Directory -Path "$dir\docs" -Force | Out-Null
        $dest = Backup-Folder -Source "$dir\docs" -DestinationRoot "$dir\backups"
        $dest | Should -Exist
    }

    It 'Find-Snippet ranks an exact alias match first' {
        (Find-Snippet ls | Select-Object -First 1).Cmdlet | Should -Be 'Get-ChildItem'
    }

    It 'Find-Snippet matches bash equivalents' {
        (Find-Snippet grep | Select-Object -First 1).Cmdlet | Should -Be 'Select-String'
    }

    It 'Find-Snippet returns typed results with a page link' {
        $hit = Find-Snippet zip | Select-Object -First 1
        $hit.PSObject.TypeNames | Should -Contain 'CopyPastePowerShell.Snippet'
        $hit.Url | Should -Match '^https://.+/commands/compress-archive/$'
    }

    It 'Find-Snippet warns instead of returning junk when nothing matches' {
        $result = Find-Snippet 'zzzz-no-such-thing' 3>$null
        $result | Should -BeNullOrEmpty
    }

    It 'Find-Snippet refuses a blank query instead of listing everything' {
        { Find-Snippet ' ' } | Should -Throw '*at least one word*'
    }
}

Describe 'Packaged module (tools/build-module.mjs --package)' {
    BeforeAll {
        $repoRoot = Split-Path -Parent $PSScriptRoot
        $out = Join-Path $TestDrive 'dist'
        & node (Join-Path $repoRoot 'tools/build-module.mjs') --package 9.8.7 --out $out | Out-Null
        $script:package = Join-Path $out 'CopyPastePowerShell'
    }

    It 'is self-contained and versioned, and leaves the repo manifest alone' {
        Join-Path $package 'Scripts/remove-old-files.ps1' | Should -Exist
        Join-Path $package 'snippets.json' | Should -Exist
        Join-Path $package 'LICENSE' | Should -Exist
        (Test-ModuleManifest -Path (Join-Path $package 'CopyPastePowerShell.psd1')).Version | Should -Be '9.8.7'
        (Test-ModuleManifest -Path (Join-Path (Split-Path -Parent $PSScriptRoot) 'module/CopyPastePowerShell/CopyPastePowerShell.psd1')).Version | Should -Not -Be '9.8.7'
    }

    It 'shows function names, not script names, in help examples' {
        $text = Get-Content -LiteralPath (Join-Path $package 'Scripts/remove-old-files.ps1') -Raw
        $text | Should -Match '(?m)^\s+Remove-OldFile -Path'
        $text | Should -Not -Match 'remove-old-files\.ps1'
    }
}
