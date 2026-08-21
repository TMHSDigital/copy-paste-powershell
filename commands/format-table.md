---
title: Show objects as a table
cmdlet: Format-Table
aliases: [ft]
category: text
difficulty: beginner
topics: [format]
command: "Get-ChildItem | Format-Table Name, Length -AutoSize"
featured: false
warning: "Format-* cmdlets are for display. Do not pipe them into Export-Csv or more processing."
summary: Pretty-print objects as columns in the console.
---

Formats output for your eyes. After `Format-Table`, the pipeline is format objects, not the original data. Filter and select first, format last.

## Try this

```powershell
Get-Process | Select-Object -First 8 Name, Id, CPU | Format-Table -AutoSize
```
