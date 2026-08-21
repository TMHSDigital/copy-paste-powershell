---
title: List files in a folder
cmdlet: Get-ChildItem
aliases: [gci, ls, dir]
category: files
difficulty: beginner
topics: [files, listing]
command: "Get-ChildItem -Path .\\docs"
featured: true
summary: "List files and folders at a path, like dir or ls."
---

Lists files and folders. Point `-Path` at a folder. Skip `-Path` and it uses the current directory.

## Common parameters

- `-Recurse` walks subfolders.
- `-File` or `-Directory` filters the type.
- `-Filter *.log` is the fast way to match a pattern.

## Try this

```powershell
Get-ChildItem -Path .\docs -Recurse -File -Filter *.md
```
