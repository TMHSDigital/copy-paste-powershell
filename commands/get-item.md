---
title: "Get one file, folder, or item"
cmdlet: Get-Item
aliases: [gi]
category: files
difficulty: beginner
topics: [files]
command: "Get-Item -Path .\\notes.txt"
featured: false
summary: "Return a single item at a path, not its children."
---

Gets the item itself. `Get-ChildItem` lists what is inside a folder. `Get-Item .\docs` is the folder object. `Get-ChildItem .\docs` is the contents.

## Try this

```powershell
Get-Item -Path .\notes.txt | Format-List *
```
