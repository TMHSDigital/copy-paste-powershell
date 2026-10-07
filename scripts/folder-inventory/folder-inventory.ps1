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

# UTF-8 with a BOM so Excel shows non-ASCII names correctly on 5.1 and 7.
$csvEncoding = if ($PSVersionTable.PSVersion.Major -ge 6) { 'utf8BOM' } else { 'UTF8' }

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

$rows = Get-ChildItem -LiteralPath $Path -Recurse -File -ErrorAction SilentlyContinue -ErrorVariable scanErrors |
    Select-Object FullName, Length, LastWriteTime, Extension

if ($scanErrors.Count -gt 0) {
    Write-Warning "$($scanErrors.Count) folder(s) skipped (access denied or unreadable)."
}

if ($PSCmdlet.ShouldProcess($OutputPath, 'Write CSV inventory')) {
    $rows | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding $csvEncoding
    Write-Output $OutputPath
}
