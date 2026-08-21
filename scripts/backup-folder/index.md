---
title: Timestamped folder backup
summary: Copy a folder into a destination parent as Name-yyyyMMdd-HHmmss.
difficulty: beginner
topics: [files, backup]
parameters:
  - name: Source
    type: string
    required: true
    description: Folder to copy.
  - name: DestinationRoot
    type: string
    required: true
    description: Parent folder that will hold the timestamped copy.
---

Copies an entire folder tree into a new timestamped directory. Preview with `-WhatIf`.

```powershell
.\backup-folder.ps1 -Source .\docs -DestinationRoot .\backups -WhatIf
.\backup-folder.ps1 -Source .\docs -DestinationRoot .\backups
```
