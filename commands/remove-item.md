---
title: Delete a file or folder
cmdlet: Remove-Item
aliases: [del, erase, rd, ri, rm, rmdir]
category: files
difficulty: beginner
topics: [files, delete]
command: "Remove-Item -Path .\\temp\\old.log"
featured: false
warning: There is no recycle bin. Deleted is gone. Use -WhatIf.
summary: Delete files or folders. Permanent. No recycle bin.
---

Deletes files or folders. Folders with contents need `-Recurse`. Some hosts also ask for `-Force`.

## Try this

```powershell
Remove-Item -Path .\temp\* -WhatIf
```
