---
title: Read a CSV file as objects
cmdlet: Import-Csv
aliases: [ipcsv]
category: text
difficulty: beginner
topics: [csv]
command: "Import-Csv -Path .\\people.csv"
featured: false
summary: Load a CSV into objects using the header row as property names.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
---

Each row becomes an object. Column headers become property names. All values are strings until you cast them.

## Try this

```powershell
Import-Csv -Path .\people.csv | Where-Object City -eq 'Albany'
```
