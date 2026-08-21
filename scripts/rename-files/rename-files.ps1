<#
.SYNOPSIS
    Add a prefix or suffix to file names in a folder.

.DESCRIPTION
    Preview is the default. Pass -Apply to rename. Combine with -WhatIf.

.PARAMETER Path
    Folder to rename files in.

.PARAMETER Prefix
    Text added at the start of the file name.

.PARAMETER Suffix
    Text added before the extension.

.PARAMETER Filter
    Wildcard, default *.

.PARAMETER Recurse
    Include subfolders.

.PARAMETER Apply
    Perform the rename. Omit for a preview.

.EXAMPLE
    .\rename-files.ps1 -Path .\docs -Prefix '2026-' -Filter *.md
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$Path,

    [string]$Prefix = '',

    [string]$Suffix = '',

    [string]$Filter = '*',

    [switch]$Recurse,

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "Folder not found: $Path"
}

if ([string]::IsNullOrWhiteSpace($Prefix) -and [string]::IsNullOrWhiteSpace($Suffix)) {
    throw 'Specify -Prefix and/or -Suffix.'
}

$items = Get-ChildItem -LiteralPath $Path -File -Filter $Filter -Recurse:$Recurse
$plan = foreach ($item in $items) {
    $newName = '{0}{1}{2}{3}' -f $Prefix, $item.BaseName, $Suffix, $item.Extension
    [pscustomobject]@{
        FullName = $item.FullName
        NewName  = $newName
    }
}

if (-not $Apply) {
    Write-Warning 'Preview only. Pass -Apply to rename.'
    $plan
    return
}

foreach ($row in $plan) {
    if ($PSCmdlet.ShouldProcess($row.FullName, "Rename to $($row.NewName)")) {
        Rename-Item -LiteralPath $row.FullName -NewName $row.NewName
    }
}
