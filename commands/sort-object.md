---
title: Sort pipeline objects
cmdlet: Sort-Object
aliases: [sort]
category: text
difficulty: beginner
topics: [pipeline, sort]
command: "Get-ChildItem | Sort-Object -Property Length -Descending"
featured: false
summary: Sort objects by one or more properties.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ls -S
  powershell: Get-ChildItem | Sort-Object -Property Length -Descending
notes:
  "7": On Linux and macOS, sort runs the system command instead of this cmdlet. Type the full cmdlet name there.
---

Sorts by a property. `-Descending` reverses it. `-Unique` drops duplicates after sorting.

## Try this

```powershell
Get-Process | Sort-Object -Property WorkingSet -Descending | Select-Object -First 10
```
