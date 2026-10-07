---
title: Test a list of hosts
summary: Ping every name or address in a text file, or check a TCP port on each.
difficulty: beginner
topics: [network, ping]
parameters:
  - name: HostsPath
    type: string
    required: true
    description: Text file with one host per line. Blank lines and # comments are skipped.
  - name: Count
    type: int
    required: false
    description: Echo requests per host when pinging. Default 1.
  - name: Port
    type: int
    required: false
    description: TCP port to test instead of pinging, for example 443.
  - name: TimeoutMs
    type: int
    required: false
    description: Milliseconds to wait for each TCP connection. Default 2000.
---

Useful as a quick "is the office printer still on the network" check. You get one row per host with `Reachable` and `LatencyMs`.

Ping (ICMP) is often blocked even when the host is up. If a server shows as unreachable but you know it is running, test the port it actually serves instead: `443` for a website, `3389` for Remote Desktop, `445` for file shares.

```powershell
.\test-hosts.ps1 -HostsPath .\hosts.txt
.\test-hosts.ps1 -HostsPath .\hosts.txt -Port 443
```
