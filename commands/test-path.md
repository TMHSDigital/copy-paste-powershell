---
title: Check whether a path exists
cmdlet: Test-Path
aliases: []
category: files
difficulty: beginner
topics: [files, testing]
command: "Test-Path -Path .\\docs"
featured: false
summary: Return True or False if a path exists.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: test -e docs && echo yes
  cmd: if exist docs echo yes
---

Returns `$true` or `$false`. Use it before you copy, move, or delete.

`-PathType Leaf` means "this is a file". `-PathType Container` means "this is a folder".

## Try this

```powershell
if (Test-Path -Path .\docs -PathType Container) { 'Folder exists' }
```
