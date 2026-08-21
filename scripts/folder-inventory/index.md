---
title: CSV folder inventory
summary: Export file name, size, and last write time for a folder tree.
difficulty: beginner
topics: [files, csv]
parameters:
  - name: Path
    type: string
    required: true
    description: Folder to inventory.
  - name: OutputPath
    type: string
    required: true
    description: CSV file to write.
---

Read-only scan. Writes a CSV you can open in Excel.

```powershell
.\folder-inventory.ps1 -Path .\docs -OutputPath .\files.csv
```
