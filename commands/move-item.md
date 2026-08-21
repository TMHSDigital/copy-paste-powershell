---
title: Move or rename by moving
cmdlet: Move-Item
aliases: [move, mi, mv]
category: files
difficulty: beginner
topics: [files, move]
command: "Move-Item -Path .\\notes.txt -Destination .\\archive\\notes.txt"
featured: false
warning: Move-Item deletes the source. Use Copy-Item if you still need the original.
summary: Move a file or folder to a new path.
---

Moves a file or folder. If the destination is on the same drive, this is a rename/move. Across drives it copies then deletes.

Always pass `-WhatIf` the first time.

## Try this

```powershell
Move-Item -Path .\notes.txt -Destination .\archive\ -WhatIf
```
