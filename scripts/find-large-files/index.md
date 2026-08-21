---
title: Find large files
summary: List files over a size threshold, largest first.
difficulty: beginner
topics: [files, disk]
parameters:
  - name: Path
    type: string
    required: true
    description: Folder to scan.
  - name: MinimumSizeMB
    type: int
    required: false
    description: Size threshold in megabytes. Default 100.
---

Walks a folder tree and prints files at or above the threshold. Read-only unless you pipe the output into something that deletes.

```powershell
.\find-large-files.ps1 -Path .\docs -MinimumSizeMB 50
```
