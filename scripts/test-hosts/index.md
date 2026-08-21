---
title: Test a list of hosts
summary: Ping every name or address in a text file, one per line.
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
    description: Echo requests per host. Default 1.
---

Useful as a quick "is the office printer still on the network" check. ICMP can be blocked even when the host is up.

```powershell
.\test-hosts.ps1 -HostsPath .\hosts.txt
```
