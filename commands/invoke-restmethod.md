---
title: Call a JSON API
cmdlet: Invoke-RestMethod
aliases: [irm]
category: network
difficulty: intermediate
topics: [network, http, json]
command: "Invoke-RestMethod -Uri 'https://example.com'"
featured: false
summary: HTTP request that parses JSON into objects for you.
---

Like `Invoke-WebRequest`, but if the body is JSON you get objects back. Use `-Method Post` and `-Body` for writes. Do not put tokens in scripts you commit.

## Try this

```powershell
Invoke-RestMethod -Uri 'https://example.com' | Get-Member
```
