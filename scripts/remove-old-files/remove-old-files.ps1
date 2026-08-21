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

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

$cutoff = (Get-Date).AddDays(-1 * $OlderThanDays)
$candidates = @(
    Get-ChildItem -LiteralPath $Path -File -Filter $Filter -Recurse:$Recurse |
        Where-Object { $_.LastWriteTime -lt $cutoff }
)

if (-not $Apply) {
    Write-Warning "Preview only. $($candidates.Count) file(s) older than $OlderThanDays day(s). Pass -Apply to delete."
    $candidates | Select-Object FullName, LastWriteTime, Length
    return
}

foreach ($item in $candidates) {
    if ($PSCmdlet.ShouldProcess($item.FullName, 'Remove-Item')) {
        Remove-Item -LiteralPath $item.FullName
    }
}
