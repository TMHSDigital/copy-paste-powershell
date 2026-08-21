---
title: Copy a file or folder
cmdlet: Copy-Item
aliases: [copy, cpi, cp]
category: files
difficulty: beginner
topics: [files, copy]
command: "Copy-Item -Path .\\notes.txt -Destination .\\backup\\notes.txt"
featured: false
summary: Copy files or folders to a new location.
---

Copies a file or folder. The destination can be a file name or a folder that already exists.

Use `-Recurse` for folders. Use `-WhatIf` first if you are unsure.

## Try this

```powershell
Copy-Item -Path .\docs -Destination .\docs-copy -Recurse -WhatIf
```
