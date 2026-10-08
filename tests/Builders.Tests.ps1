#Requires -Modules @{ ModuleName = 'Pester'; ModuleVersion = '5.0' }

# Runs builder output for real against throwaway folders. Snippets.Tests.ps1
# only proves the output parses; these prove it does what the page says.

BeforeAll {
    $script:RepoRoot = Split-Path -Parent $PSScriptRoot

    # Render a builder with the given form values (others keep their defaults).
    function Get-BuilderScript([string]$Name, [hashtable]$Values = @{}) {
        $json = Join-Path $TestDrive ([guid]::NewGuid().ToString('n') + '.json')
        [System.IO.File]::WriteAllText($json, ($Values | ConvertTo-Json -Compress), (New-Object System.Text.UTF8Encoding($false)))
        $out = & node (Join-Path $RepoRoot 'tools/render-builder.mjs') $Name $json 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "render-builder failed for ${Name}: $out"
        }
        ($out | ForEach-Object { "$_" }) -join "`n"
    }

    function Invoke-BuilderScript([string]$Name, [hashtable]$Values = @{}) {
        $code = Get-BuilderScript $Name $Values
        & ([scriptblock]::Create($code))
    }

    # A folder whose name has a space and brackets, the paths that break -Path.
    function New-Sandbox {
        $dir = Join-Path $TestDrive ('box [' + [guid]::NewGuid().ToString('n').Substring(0, 6) + ']')
        [System.IO.Directory]::CreateDirectory($dir) | Out-Null
        $dir
    }

    # Should -Exist treats brackets as wildcards, so check paths literally.
    function Test-Literal([string]$Parent, [string]$Child) {
        Test-Path -LiteralPath (Join-Path $Parent $Child)
    }

    function New-OldFile([string]$Path, [int]$Days = 40) {
        Set-Content -LiteralPath $Path -Value 'x'
        (Get-Item -LiteralPath $Path).LastWriteTime = (Get-Date).AddDays(-$Days)
    }
}

Describe 'rename-prefix builder' {
    BeforeEach {
        $box = New-Sandbox
        'a', 'x-b', 'c-v2', 'x-d-v2' | ForEach-Object { Set-Content -LiteralPath (Join-Path $box "$_.txt") -Value $_ }
    }

    It 'adds only the missing part and leaves finished files alone' {
        $out = Invoke-BuilderScript 'rename-prefix' @{ path = $box; filter = '*.txt'; prefix = 'x-'; suffix = '-v2'; whatIf = $false }
        (Get-ChildItem -LiteralPath $box).Name | Sort-Object | Should -Be @('x-a-v2.txt', 'x-b-v2.txt', 'x-c-v2.txt', 'x-d-v2.txt')
        "$out" | Should -Match 'Skipped .*x-d-v2\.txt'
    }

    It 'is a no-op the second time' {
        $values = @{ path = $box; filter = '*.txt'; prefix = 'x-'; suffix = '-v2'; whatIf = $false }
        Invoke-BuilderScript 'rename-prefix' $values | Out-Null
        Invoke-BuilderScript 'rename-prefix' $values | Out-Null
        (Get-ChildItem -LiteralPath $box).Name | Sort-Object | Should -Be @('x-a-v2.txt', 'x-b-v2.txt', 'x-c-v2.txt', 'x-d-v2.txt')
    }

    It 'ignores case when checking for the prefix' {
        Set-Content -LiteralPath (Join-Path $box 'X-e.txt') -Value 'e'
        Invoke-BuilderScript 'rename-prefix' @{ path = $box; filter = 'X-e.txt'; prefix = 'x-'; whatIf = $false } | Out-Null
        Test-Literal $box 'X-e.txt' | Should -BeTrue
        Test-Literal $box 'x-X-e.txt' | Should -BeFalse
    }
}

Describe 'remove-old-files builder' {
    It 'deletes only names that really match the filter' {
        $box = New-Sandbox
        New-OldFile (Join-Path $box 'page.html')
        New-OldFile (Join-Path $box 'page.htm')
        Invoke-BuilderScript 'remove-old-files' @{ path = $box; filter = '*.htm'; days = '30'; whatIf = $false }
        Test-Literal $box 'page.html' | Should -BeTrue
        Test-Literal $box 'page.htm' | Should -BeFalse
    }

    It 'changes nothing with the default preview' {
        $box = New-Sandbox
        New-OldFile (Join-Path $box 'a.log')
        Invoke-BuilderScript 'remove-old-files' @{ path = $box } 6>$null | Out-Null
        Test-Literal $box 'a.log' | Should -BeTrue
    }
}
