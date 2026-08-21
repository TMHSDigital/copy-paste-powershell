<#
.SYNOPSIS
    Ping each host listed in a text file.

.PARAMETER HostsPath
    Text file, one host per line. Lines starting with # are ignored.

.PARAMETER Count
    Echo requests per host. Default 1.

.EXAMPLE
    .\test-hosts.ps1 -HostsPath .\hosts.txt
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$HostsPath,

    [int]$Count = 1
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $HostsPath -PathType Leaf)) {
    throw "Hosts file not found: $HostsPath"
}

$names = Get-Content -LiteralPath $HostsPath |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ -and ($_ -notmatch '^#') }

foreach ($name in $names) {
    if (-not $PSCmdlet.ShouldProcess($name, 'Test-Connection')) {
        continue
    }

    $ok = Test-Connection -ComputerName $name -Count $Count -Quiet -ErrorAction SilentlyContinue
    [pscustomobject]@{
        Host      = $name
        Reachable = [bool]$ok
    }
}
