<#
.SYNOPSIS
    Export installed programs from Uninstall registry keys to CSV.

.PARAMETER OutputPath
    CSV file to write.

.EXAMPLE
    .\export-installed-programs.ps1 -OutputPath .\programs.csv
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$keys = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)

$rows = foreach ($key in $keys) {
    Get-ItemProperty -Path $key -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName } |
        Select-Object DisplayName, DisplayVersion, Publisher, InstallDate
}

$unique = $rows | Sort-Object DisplayName, DisplayVersion -Unique

if ($PSCmdlet.ShouldProcess($OutputPath, 'Write installed programs CSV')) {
    $unique | Export-Csv -Path $OutputPath -NoTypeInformation
    Write-Output $OutputPath
}
