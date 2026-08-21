<#
.SYNOPSIS
    Copy a folder to a timestamped backup directory.

.DESCRIPTION
    Creates DestinationRoot if needed, then copies Source to
    DestinationRoot\<leaf>-yyyyMMdd-HHmmss.

.PARAMETER Source
    Folder to copy.

.PARAMETER DestinationRoot
    Parent folder for the timestamped backup.

.EXAMPLE
    .\backup-folder.ps1 -Source .\docs -DestinationRoot .\backups -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$Source,

    [Parameter(Mandatory)]
    [string]$DestinationRoot
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
    throw "Source folder not found: $Source"
}

if (-not (Test-Path -LiteralPath $DestinationRoot -PathType Container)) {
    if ($PSCmdlet.ShouldProcess($DestinationRoot, 'Create destination parent folder')) {
        New-Item -ItemType Directory -Path $DestinationRoot | Out-Null
    }
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$leaf = Split-Path -LiteralPath $Source -Leaf
$dest = Join-Path -Path $DestinationRoot -ChildPath "$leaf-$stamp"

if ($PSCmdlet.ShouldProcess($Source, "Copy to $dest")) {
    Copy-Item -LiteralPath $Source -Destination $dest -Recurse
    Write-Output $dest
}
