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
module: Microsoft.PowerShell.Core
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ls | grep '\.md$'
output: |2-
      Directory: C:\Path\To\project

  Mode                 LastWriteTime         Length Name
  ----                 -------------         ------ ----
  -a---          10/2/2026  3:15 PM           4120 CONTRIBUTING.md
  -a---          10/6/2026  8:47 AM           2875 README.md
---

Filters the pipeline. `$_` is the current object. Comparison operators: `-eq`, `-ne`, `-like`, `-gt`, `-lt`.

There is a simpler syntax: `Where-Object Extension -eq '.md'`.

## Try this

```powershell
Get-Service | Where-Object Status -eq 'Running'
```
