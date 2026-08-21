---
title: Pull a folder or name out of a path
cmdlet: Split-Path
aliases: []
category: files
difficulty: beginner
topics: [files, paths]
command: "Split-Path -Path .\\docs\\notes.txt -Parent"
featured: false
summary: Return the parent folder or the leaf name of a path.
---

`-Parent` returns the folder. `-Leaf` returns the file or last segment. Useful when you have a full path and need one piece.

## Try this

```powershell
Split-Path -Path .\docs\notes.txt -Leaf
```
