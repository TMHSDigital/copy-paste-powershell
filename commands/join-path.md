---
title: Build a path safely
cmdlet: Join-Path
aliases: []
category: files
difficulty: beginner
topics: [files, paths]
command: "Join-Path -Path .\\docs -ChildPath 'notes.txt'"
featured: false
summary: Combine folder and file names without worrying about backslashes.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
---

Joins path parts and gets the separators right. Prefer this over string concatenation.

## Try this

```powershell
Join-Path -Path $env:TEMP -ChildPath 'demo.log'
```
