<#
.SYNOPSIS
    Write a CSV inventory of files under a folder.

.PARAMETER Path
    Folder to scan.

.PARAMETER OutputPath
    CSV path to write.

.EXAMPLE
    .\folder-inventory.ps1 -Path .\docs -OutputPath .\files.csv
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$Path,

    [Parameter(Mandatory)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

$rows = Get-ChildItem -LiteralPath $Path -Recurse -File -ErrorAction SilentlyContinue |
    Select-Object FullName, Length, LastWriteTime, Extension

if ($PSCmdlet.ShouldProcess($OutputPath, 'Write CSV inventory')) {
    $rows | Export-Csv -Path $OutputPath -NoTypeInformation
    Write-Output $OutputPath
}
