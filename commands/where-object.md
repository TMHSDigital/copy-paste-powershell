---
title: Filter objects in the pipeline
cmdlet: Where-Object
aliases: [where, "?"]
category: text
difficulty: beginner
topics: [pipeline, filter]
command: "Get-ChildItem | Where-Object { $_.Extension -eq '.md' }"
featured: true
summary: Keep only the objects that match a condition.
---

Filters the pipeline. `$_` is the current object. Comparison operators: `-eq`, `-ne`, `-like`, `-gt`, `-lt`.

There is a simpler syntax: `Where-Object Extension -eq '.md'`.

## Try this

```powershell
Get-Service | Where-Object Status -eq 'Running'
```
