---
title: List local IP addresses
cmdlet: Get-NetIPAddress
aliases: []
category: network
difficulty: beginner
topics: [network, ip]
command: "Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress"
featured: false
summary: Show IPv4 and IPv6 addresses on this machine. Windows only.
---

Windows-only (NetTCPIP module). Filter with `-AddressFamily IPv4` to skip IPv6 link-local noise.

## Try this

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object IPAddress -notlike '169.254*'
```
