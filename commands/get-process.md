---
title: List running processes
cmdlet: Get-Process
aliases: [gps, ps]
category: system
difficulty: beginner
topics: [process]
command: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10"
featured: true
summary: "See what is running, with CPU and memory."
---

Lists processes. `-Name pwsh` filters by name (no `.exe`). WorkingSet is memory in bytes.

## Try this

```powershell
Get-Process -Name explorer | Format-List *
```
