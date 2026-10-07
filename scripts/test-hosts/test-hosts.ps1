<#
.SYNOPSIS
    Ping each host listed in a text file, or test a TCP port on each.

.DESCRIPTION
    Without -Port, sends ICMP echo requests (ping). Many hosts block ping
    and still work, so -Port checks a TCP port instead (for example 443 for
    a web server or 3389 for Remote Desktop). Works on Windows, Linux, and macOS.

.PARAMETER HostsPath
    Text file, one host per line. Blank lines and lines starting with # are ignored.

.PARAMETER Count
    Echo requests per host when pinging. Default 1.

.PARAMETER Port
    TCP port to test instead of pinging.

.PARAMETER TimeoutMs
    How long to wait for each TCP connection, in milliseconds. Default 2000.

.EXAMPLE
    .\test-hosts.ps1 -HostsPath .\hosts.txt

.EXAMPLE
    .\test-hosts.ps1 -HostsPath .\hosts.txt -Port 443
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$HostsPath,

    [ValidateRange(1, 100)]
    [int]$Count = 1,

    [ValidateRange(1, 65535)]
    [int]$Port,

    [ValidateRange(100, 60000)]
    [int]$TimeoutMs = 2000
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $HostsPath -PathType Leaf)) {
    throw "Hosts file not found: $HostsPath"
}

$names = Get-Content -LiteralPath $HostsPath |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ -and ($_ -notmatch '^#') }

function Test-TcpPort {
    param([string]$ComputerName, [int]$PortNumber, [int]$Timeout)
    $client = New-Object System.Net.Sockets.TcpClient
    $watch = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $task = $client.ConnectAsync($ComputerName, $PortNumber)
        $ok = $task.Wait($Timeout) -and $client.Connected
    } catch {
        $ok = $false
    } finally {
        $watch.Stop()
        $client.Dispose()
    }
    [pscustomobject]@{
        Reachable = [bool]$ok
        LatencyMs = if ($ok) { [int]$watch.ElapsedMilliseconds } else { $null }
    }
}

foreach ($name in $names) {
    if ($PSBoundParameters.ContainsKey('Port')) {
        $result = Test-TcpPort -ComputerName $name -PortNumber $Port -Timeout $TimeoutMs
        [pscustomobject]@{
            Host      = $name
            Port      = $Port
            Reachable = $result.Reachable
            LatencyMs = $result.LatencyMs
        }
        continue
    }

    # PowerShell 7 returns objects with Status and Latency; 5.1 returns
    # Win32_PingStatus with StatusCode and ResponseTime.
    $replies = @(Test-Connection -ComputerName $name -Count $Count -ErrorAction SilentlyContinue)
    $good = @($replies | Where-Object {
        if ($_.PSObject.Properties['Latency']) { "$($_.Status)" -eq 'Success' } else { $_.StatusCode -eq 0 }
    })
    $times = @($good | ForEach-Object {
        if ($_.PSObject.Properties['Latency']) { $_.Latency } else { $_.ResponseTime }
    })
    [pscustomobject]@{
        Host      = $name
        Port      = $null
        Reachable = $good.Count -gt 0
        LatencyMs = if ($times.Count -gt 0) { [int](($times | Measure-Object -Average).Average) } else { $null }
    }
}
