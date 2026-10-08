<#
.SYNOPSIS
    Add a prefix or suffix to file names in a folder.

.DESCRIPTION
    Preview is the default. Pass -Apply to rename. Combine with -WhatIf.
    Files that already carry the prefix and suffix are skipped, so running
    twice is safe. Name conflicts are reported and skipped, never half-applied.

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

$comparison = [System.StringComparison]::OrdinalIgnoreCase
# On Windows PowerShell 5.1, -Filter also matches 8.3 short names, so check
# the real name too. Brackets in -Filter are literal, so escape them for -like.
$namePattern = $Filter -replace '([\[\]])', '`$1'
$items = @(
    Get-ChildItem -LiteralPath $Path -File -Filter $Filter -Recurse:$Recurse |
        Where-Object { $_.Name -like $namePattern }
)
$targets = @{}

$plan = foreach ($item in $items) {
    $hasPrefix = $Prefix -eq '' -or $item.BaseName.StartsWith($Prefix, $comparison)
    $hasSuffix = $Suffix -eq '' -or $item.BaseName.EndsWith($Suffix, $comparison)
    # Add only the parts that are missing, so a half-renamed file is not
    # given the prefix twice.
    $newBase = $item.BaseName
    if (-not $hasPrefix) { $newBase = $Prefix + $newBase }
    if (-not $hasSuffix) { $newBase = $newBase + $Suffix }
    $newName = $newBase + $item.Extension
    $target = Join-Path -Path $item.DirectoryName -ChildPath $newName

    $status = if ($hasPrefix -and $hasSuffix) {
        'Skip (already renamed)'
    } elseif (Test-Path -LiteralPath $target) {
        'Conflict (target exists)'
    } elseif ($targets.ContainsKey($target)) {
        'Conflict (duplicate target)'
    } else {
        'Rename'
    }
    $targets[$target] = $true

    [pscustomobject]@{
        FullName = $item.FullName
        NewName  = $newName
        Status   = $status
    }
}
$plan = @($plan)
$conflicts = @($plan | Where-Object { $_.Status -like 'Conflict*' })

if (-not $Apply) {
    if ($conflicts.Count -gt 0) {
        Write-Warning "$($conflicts.Count) conflict(s) will be skipped. See the Status column."
    }
    Write-Warning 'Preview only. Pass -Apply to rename.'
    $plan
    return
}

$renamed = 0
$failed = 0
foreach ($row in $plan | Where-Object { $_.Status -eq 'Rename' }) {
    if ($PSCmdlet.ShouldProcess($row.FullName, "Rename to $($row.NewName)")) {
        try {
            Rename-Item -LiteralPath $row.FullName -NewName $row.NewName
            $renamed++
        } catch {
            $failed++
            Write-Warning "Could not rename $($row.FullName): $($_.Exception.Message)"
        }
    }
}

$skipped = @($plan | Where-Object { $_.Status -like 'Skip*' }).Count
Write-Output ("Renamed {0}, skipped {1}, conflicts {2}, failed {3}." -f $renamed, $skipped, $conflicts.Count, $failed)
