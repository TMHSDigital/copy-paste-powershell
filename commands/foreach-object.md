---
title: Run a block on each object
cmdlet: ForEach-Object
aliases: [foreach, "%"]
category: text
difficulty: beginner
topics: [pipeline, loop]
command: "Get-ChildItem -File | ForEach-Object { $_.Name }"
featured: false
summary: Do something to every object that comes down the pipeline.
module: Microsoft.PowerShell.Core
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: for f in *; do echo "$f"; done
  cmd: for %f in (*) do @echo %f
---

Runs a script block once per object. `$_` is the item. For a simple property, `ForEach-Object Name` (PS 3+) is enough.

If you are building a list in memory, a `foreach` loop can be clearer. The cmdlet shines in a pipeline.

## Try this

```powershell
Get-ChildItem -File | ForEach-Object { $_.Name.ToUpper() }
```
