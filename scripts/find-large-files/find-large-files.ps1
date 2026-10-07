<#
.SYNOPSIS
    List files larger than a given size.

.PARAMETER Path
    Folder to scan.

.PARAMETER MinimumSizeMB
    Size threshold in megabytes. Default 100.

.EXAMPLE
    .\find-large-files.ps1 -Path .\docs -MinimumSizeMB 50
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$Path,

    [ValidateRange(0, 1048576)]
    [int]$MinimumSizeMB = 100
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

$threshold = $MinimumSizeMB * 1MB

Get-ChildItem -LiteralPath $Path -Recurse -File -ErrorAction SilentlyContinue -ErrorVariable scanErrors |
    Where-Object { $_.Length -ge $threshold } |
    Sort-Object -Property Length -Descending |
    Select-Object FullName, @{ Name = 'SizeMB'; Expression = { [math]::Round($_.Length / 1MB, 2) } }, LastWriteTime

if ($scanErrors.Count -gt 0) {
    Write-Warning "$($scanErrors.Count) folder(s) skipped (access denied or unreadable)."
}
