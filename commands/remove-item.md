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
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: rm -rf temp/
  cmd: rmdir /s /q temp
  powershell: Remove-Item -Path .\temp -Recurse -Force -WhatIf
  note: Remove -WhatIf only when the preview looks right.
notes:
  "7": On Linux and macOS, rm runs the system command instead of this cmdlet. Type the full cmdlet name there.
---

Deletes files or folders. Folders with contents need `-Recurse`. Some hosts also ask for `-Force`.

## Try this

```powershell
Remove-Item -Path .\temp\* -WhatIf
```
