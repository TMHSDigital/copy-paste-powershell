<#
.SYNOPSIS
    Delete files older than a given number of days.

.DESCRIPTION
    Preview unless -Apply is passed. Use -WhatIf with -Apply.

.PARAMETER Path
    Folder to clean.

.PARAMETER OlderThanDays
    Files with LastWriteTime older than this many days are candidates.

.PARAMETER Filter
    Wildcard. Default *.

.PARAMETER Recurse
    Include subfolders.

.PARAMETER Force
    Also delete read-only files.

.PARAMETER Apply
    Perform deletes.

.EXAMPLE
    .\remove-old-files.ps1 -Path .\logs -OlderThanDays 30 -Filter *.log
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$Path,

    [Parameter(Mandatory)]
    [ValidateRange(1, 36500)]
    [int]$OlderThanDays,

    [string]$Filter = '*',

    [switch]$Recurse,

    [switch]$Force,

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

$cutoff = (Get-Date).AddDays(-1 * $OlderThanDays)
# On Windows PowerShell 5.1, -Filter also matches 8.3 short names, so '*.htm'
# finds 'page.html'. Check the real name too. Brackets in -Filter are literal,
# so escape them for -like.
$namePattern = $Filter -replace '([\[\]])', '`$1'
$candidates = @(
    Get-ChildItem -LiteralPath $Path -File -Filter $Filter -Recurse:$Recurse -ErrorAction SilentlyContinue -ErrorVariable scanErrors |
        Where-Object { $_.Name -like $namePattern -and $_.LastWriteTime -lt $cutoff }
)

if ($scanErrors.Count -gt 0) {
    Write-Warning "$($scanErrors.Count) folder(s) skipped (access denied or unreadable)."
}

if (-not $Apply) {
    Write-Warning "Preview only. $($candidates.Count) file(s) older than $OlderThanDays day(s). Pass -Apply to delete."
    $candidates | Select-Object FullName, LastWriteTime, Length
    return
}

$removed = 0
$failed = 0
foreach ($item in $candidates) {
    if ($PSCmdlet.ShouldProcess($item.FullName, 'Remove-Item')) {
        try {
            Remove-Item -LiteralPath $item.FullName -Force:$Force
            $removed++
        } catch {
            $failed++
            Write-Warning "Could not delete $($item.FullName): $($_.Exception.Message)"
        }
    }
}

Write-Output ("Removed {0}, failed {1}." -f $removed, $failed)
