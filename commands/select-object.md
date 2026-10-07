---
title: Pick properties or the first N objects
cmdlet: Select-Object
aliases: [select]
category: text
difficulty: beginner
topics: [pipeline, objects]
command: "Get-ChildItem | Select-Object -First 5 Name, Length"
featured: false
summary: "Keep some properties, or only the first or last objects."
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ls | head -5
  powershell: Get-ChildItem | Select-Object -First 5
---

Two jobs: cut the list (`-First`, `-Last`, `-Skip`) and cut the shape (`-Property`).

`Select-Object Name, Length` returns slim objects with those properties only.

## Try this

```powershell
Get-Process | Select-Object -First 10 Name, CPU, WorkingSet
```
