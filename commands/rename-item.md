---
title: Rename a file or folder
cmdlet: Rename-Item
aliases: [ren, rni]
category: files
difficulty: beginner
topics: [files, rename]
command: "Rename-Item -Path .\\draft.txt -NewName final.txt"
featured: false
summary: Change the name of a file or folder in place.
---

Renames something in the same folder. `-NewName` is a name, not a full path. To move and rename, use `Move-Item`.

## Try this

```powershell
Rename-Item -Path .\draft.txt -NewName final.txt -WhatIf
```
