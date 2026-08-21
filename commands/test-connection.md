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
---

Ping. `-Count 2` keeps it short. In PowerShell 7, `-TargetName` is the modern parameter name. `-ComputerName` still works on Windows PowerShell 5.1.

This is ICMP. A host can be up and still block ping.

## Try this

```powershell
Test-Connection -ComputerName localhost -Count 1
```
