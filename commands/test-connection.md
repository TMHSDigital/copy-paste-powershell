---
title: Ping a host
cmdlet: Test-Connection
aliases: []
category: network
difficulty: beginner
topics: [network, ping]
command: Test-Connection -ComputerName 1.1.1.1 -Count 2
featured: true
summary: ICMP ping from PowerShell.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ping -c 2 1.1.1.1
  cmd: ping -n 2 1.1.1.1
notes:
  "7": Works everywhere. Results have Latency and Status columns, and -ComputerName is an alias for -TargetName.
  "5.1": Windows only. Returns Win32_PingStatus objects; the time is in ResponseTime.
output: |2-
     Destination: 1.1.1.1

  Ping Source           Address                   Latency BufferSize Status
                                                     (ms)        (B)
  ---- ------           -------                   ------- ---------- ------
     1 MY-LAPTOP        1.1.1.1                        12         32 Success
     2 MY-LAPTOP        1.1.1.1                        11         32 Success
---

Ping. `-Count 2` keeps it short. In PowerShell 7, `-TargetName` is the modern parameter name. `-ComputerName` still works on Windows PowerShell 5.1.

This is ICMP. A host can be up and still block ping.

## Try this

```powershell
Test-Connection -ComputerName localhost -Count 1
```
