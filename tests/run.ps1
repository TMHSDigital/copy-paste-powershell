<#
.SYNOPSIS
    Run the PowerShell test suite (Pester) and, optionally, PSScriptAnalyzer.

.DESCRIPTION
    Works in Windows PowerShell 5.1 and PowerShell 7. Needs Pester 5 or later:
        Install-Module Pester -MinimumVersion 5.5.0 -Scope CurrentUser -Force -SkipPublisherCheck
    and, for -Lint, PSScriptAnalyzer:
        Install-Module PSScriptAnalyzer -RequiredVersion 1.25.0 -Scope CurrentUser -Force

    The snippet tests call `node tools/extract-snippets.mjs`, so run `npm ci` first.

.PARAMETER Lint
    Also run PSScriptAnalyzer over scripts/, module/, and tests/.

.EXAMPLE
    ./tests/run.ps1 -Lint
#>
[CmdletBinding()]
param(
    [switch]$Lint
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

$pester = Get-Module -ListAvailable Pester | Sort-Object Version -Descending | Select-Object -First 1
if (-not $pester -or $pester.Version.Major -lt 5) {
    throw 'Pester 5 or later is required. Install-Module Pester -MinimumVersion 5.5.0 -Scope CurrentUser -Force -SkipPublisherCheck'
}
Import-Module $pester.Path -Force

$failed = 0

if ($Lint) {
    $settings = Join-Path $repoRoot 'PSScriptAnalyzerSettings.psd1'
    $paths = @('scripts', 'module') | ForEach-Object { Join-Path $repoRoot $_ } | Where-Object { Test-Path $_ }
    $findings = @($paths | ForEach-Object { Invoke-ScriptAnalyzer -Path $_ -Recurse -Settings $settings })
    # Tests too, minus two rules that misfire there: test helpers such as
    # New-Sandbox do not need -WhatIf, and Pester's BeforeDiscovery variables
    # look unused to the analyzer.
    $testExclusions = @('PSUseShouldProcessForStateChangingFunctions', 'PSUseDeclaredVarsMoreThanAssignments')
    $findings += @(Invoke-ScriptAnalyzer -Path (Join-Path $repoRoot 'tests') -Recurse -Settings $settings |
            Where-Object { $testExclusions -notcontains $_.RuleName })
    if ($findings.Count -gt 0) {
        $findings | Format-Table RuleName, Severity, ScriptName, Line, Message -AutoSize -Wrap | Out-String -Width 200 | Write-Host
        Write-Host "PSScriptAnalyzer: $($findings.Count) finding(s)." -ForegroundColor Red
        $failed++
    } else {
        Write-Host 'PSScriptAnalyzer: clean.' -ForegroundColor Green
    }
}

$config = New-PesterConfiguration
$config.Run.Path = Join-Path $repoRoot 'tests'
$config.Run.PassThru = $true
$config.Output.Verbosity = 'Normal'
$result = Invoke-Pester -Configuration $config
if ($result.FailedCount -gt 0 -or $result.Result -ne 'Passed') {
    $failed++
}

Write-Host ("PowerShell {0}: {1} passed, {2} failed" -f $PSVersionTable.PSVersion, $result.PassedCount, $result.FailedCount)
exit $failed
