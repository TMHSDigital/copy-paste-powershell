---
title: Export installed programs
summary: Write uninstall registry entries to a CSV (Windows).
difficulty: intermediate
topics: [system, inventory]
parameters:
  - name: OutputPath
    type: string
    required: true
    description: CSV file to write.
---

Reads the Uninstall keys for the current view of the registry. 32-bit vs 64-bit and per-user installs can hide entries. This is a starting inventory, not a perfect software CMDB.

```powershell
.\export-installed-programs.ps1 -OutputPath .\programs.csv
```
