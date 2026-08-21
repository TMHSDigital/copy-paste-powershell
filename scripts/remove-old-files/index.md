---
title: Remove files older than N days
summary: Delete files whose last write time is older than a threshold. Preview first.
difficulty: intermediate
topics: [files, delete]
parameters:
  - name: Path
    type: string
    required: true
    description: Folder to clean.
  - name: OlderThanDays
    type: int
    required: true
    description: Age in days. Files last written before this cutoff are candidates.
  - name: Filter
    type: string
    required: false
    description: Wildcard filter. Default *.
  - name: Recurse
    type: switch
    required: false
    description: Include subfolders.
  - name: Apply
    type: switch
    required: false
    description: Actually delete. Omit for a preview.
---

**Preview is the default.** Pass `-Apply` to delete. Keep `-WhatIf` on the first real run.

```powershell
.\remove-old-files.ps1 -Path .\logs -OlderThanDays 30 -Filter *.log
.\remove-old-files.ps1 -Path .\logs -OlderThanDays 30 -Filter *.log -Apply -WhatIf
```
