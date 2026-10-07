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
    description: Parent folder that will hold the timestamped copy. Must not be inside Source.
---

Copies an entire folder tree into a new timestamped directory, for example `.ackups\docs-20260107-093000`. Preview with `-WhatIf`.

The destination has to be outside the folder you are backing up. Otherwise the backup would try to copy itself, so the script stops before it touches anything.

```powershell
.\backup-folder.ps1 -Source .\docs -DestinationRoot .\backups -WhatIf
.\backup-folder.ps1 -Source .\docs -DestinationRoot .\backups
```
