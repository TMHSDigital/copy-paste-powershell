---
title: Get the current date and time
cmdlet: Get-Date
aliases: []
category: system
difficulty: beginner
topics: [time]
command: "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"
featured: false
summary: "Current date, time, or a formatted timestamp."
---

Returns a DateTime. `-Format` uses .NET format strings. `yyyy-MM-dd` is the one you want in file names.

## Try this

```powershell
Get-Date
(Get-Date).AddDays(-7)
```
