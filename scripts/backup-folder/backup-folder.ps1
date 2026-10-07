<#
.SYNOPSIS
    Copy a folder to a timestamped backup directory.

.DESCRIPTION
    Copies Source to DestinationRoot\<folder name>-yyyyMMdd-HHmmss.
    Creates DestinationRoot if needed. Refuses to back a folder up into itself.

.PARAMETER Source
    Folder to copy.

.PARAMETER DestinationRoot
    Parent folder for the timestamped backup. Must not be inside Source.

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

$sourceItem = Get-Item -LiteralPath $Source
$sourceFull = $sourceItem.FullName.TrimEnd('\', '/')
$destFull = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($DestinationRoot).TrimEnd('\', '/')

$separator = [System.IO.Path]::DirectorySeparatorChar
$comparison = [System.StringComparison]::OrdinalIgnoreCase
if ($destFull.Equals($sourceFull, $comparison) -or $destFull.StartsWith($sourceFull + $separator, $comparison)) {
    throw "DestinationRoot is inside Source. Pick a folder outside '$sourceFull' or the backup would copy itself."
}

# A drive root has no folder name, so fall back to a fixed label.
$leaf = $sourceItem.Name.TrimEnd(':', '\', '/')
if ([string]::IsNullOrWhiteSpace($leaf)) {
    $leaf = 'backup'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$dest = Join-Path -Path $destFull -ChildPath "$leaf-$stamp"

if (-not (Test-Path -LiteralPath $destFull -PathType Container)) {
    if ($PSCmdlet.ShouldProcess($destFull, 'Create destination parent folder')) {
        New-Item -ItemType Directory -Path $destFull | Out-Null
    }
}

if ($PSCmdlet.ShouldProcess($sourceFull, "Copy to $dest")) {
    Copy-Item -LiteralPath $sourceFull -Destination $dest -Recurse
    Write-Output $dest
}
