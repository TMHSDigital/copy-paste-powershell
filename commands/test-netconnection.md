---
title: Test a TCP port or route
cmdlet: Test-NetConnection
aliases: [tnc]
category: network
difficulty: beginner
topics: [network, tcp]
command: Test-NetConnection -ComputerName example.com -Port 443
featured: false
summary: "Check DNS, ping, and a TCP port in one command. Windows only."
module: NetTCPIP
platforms:
  - windows
equivalents:
  bash: nc -zv example.com 443
---

Windows-only and slower than `Test-Connection`. Worth it when you care about a port. `TcpTestSucceeded` is the property that matters.

## Try this

```powershell
Test-NetConnection -ComputerName example.com -Port 443 | Select-Object ComputerName, RemotePort, TcpTestSucceeded
```
