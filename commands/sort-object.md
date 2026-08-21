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
---

Sorts by a property. `-Descending` reverses it. `-Unique` drops duplicates after sorting.

## Try this

```powershell
Get-Process | Sort-Object -Property WorkingSet -Descending | Select-Object -First 10
```
