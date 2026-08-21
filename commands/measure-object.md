---
title: "Count, sum, or average"
cmdlet: Measure-Object
aliases: [measure]
category: text
difficulty: beginner
topics: [pipeline, stats]
command: "Get-ChildItem -File | Measure-Object -Property Length -Sum"
featured: false
summary: "Count objects, or sum and average a numeric property."
---

Without parameters it counts. With `-Property Length -Sum` it adds file sizes. Also supports `-Average`, `-Minimum`, `-Maximum`, and `-Line` / `-Word` / `-Character` for text.

## Try this

```powershell
Get-Content -Path .\notes.txt | Measure-Object -Line -Word
```
