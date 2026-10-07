#Requires -Modules @{ ModuleName = 'Pester'; ModuleVersion = '5.0' }

# Every PowerShell snippet on the site must at least parse. Builder output is
# also checked so that tricky input stays inside a single string literal.

BeforeDiscovery {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    $out = Join-Path ([System.IO.Path]::GetTempPath()) "pfd-snippets-$PID.json"
    & node (Join-Path $repoRoot 'tools/extract-snippets.mjs') $out | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'tools/extract-snippets.mjs failed. Run npm ci first.'
    }
    $raw = [System.IO.File]::ReadAllText($out, [System.Text.Encoding]::UTF8)
    Remove-Item -LiteralPath $out
    # Windows PowerShell 5.1 emits a JSON array as one object, so enumerate it explicitly.
    $parsed = $raw | ConvertFrom-Json
    $snippets = @(foreach ($item in $parsed) {
        @{ Source = $item.source; Label = $item.label; Code = $item.code; Tricky = $item.tricky }
    })
}

Describe 'Site snippets' {
    It '<Source> (<Label>) parses' -ForEach $snippets {
        $errors = $null
        [System.Management.Automation.Language.Parser]::ParseInput($Code, [ref]$null, [ref]$errors) | Out-Null
        ($errors | ForEach-Object { $_.Message }) -join '; ' | Should -BeNullOrEmpty
    }

    It '<Source> (<Label>) keeps tricky input inside one string literal' -ForEach ($snippets | Where-Object { $_.Tricky }) {
        $tokens = $null
        [System.Management.Automation.Language.Parser]::ParseInput($Code, [ref]$tokens, [ref]$null) | Out-Null
        $literal = @($tokens | Where-Object { $_.Kind -eq 'StringLiteral' -and $_.Value -eq $Tricky })
        $literal.Count | Should -BeGreaterThan 0 -Because "the input should reach PowerShell as the literal text '$Tricky'"
        # Nothing the user typed may turn into a variable or subexpression.
        @($tokens | Where-Object { $_.Kind -eq 'Variable' -and $_.Text -eq '$old' }).Count | Should -Be 0
    }
}
