---
title: Look up a DNS name
cmdlet: Resolve-DnsName
aliases: []
category: network
difficulty: beginner
topics: [network, dns]
command: Resolve-DnsName -Name example.com
featured: false
summary: DNS lookup. Windows. Replaces nslookup for most cases.
---

Windows-only. `-Type A` or `-Type MX` when you care about a record type. On PowerShell 7 on Linux/macOS, use `Resolve-DnsName` only if the module exists, or call `nslookup`.

## Try this

```powershell
Resolve-DnsName -Name example.com -Type A
```
