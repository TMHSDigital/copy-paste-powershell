---
title: Turn a relative path into a full path
cmdlet: Resolve-Path
aliases: [rvpa]
category: files
difficulty: beginner
topics: [files, paths]
command: "Resolve-Path -Path .\\docs"
featured: false
summary: Expand . and .. into an absolute path. The path must exist.
---

Resolves wildcards and relative paths. Throws if the path does not exist. For a path you are about to create, use `Join-Path` with `Get-Location` instead.

## Try this

```powershell
Resolve-Path -Path .\docs\*.md
```
