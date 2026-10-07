---
title: Bulk rename files
summary: Add a prefix or suffix to file names. Dry-run by default.
difficulty: beginner
topics: [files, rename]
parameters:
  - name: Path
    type: string
    required: true
    description: Folder whose files will be renamed.
  - name: Prefix
    type: string
    required: false
    description: Text to prepend to each file name.
  - name: Suffix
    type: string
    required: false
    description: Text to insert before the extension.
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
    description: Actually rename. Omit for a preview.
---

Renames files in place. **Does nothing until you pass `-Apply`.** Without it, you get a preview table. `-WhatIf` still works when `-Apply` is on.

The preview has a `Status` column. Files that already have the prefix or suffix are skipped, so running it twice is safe. If a new name would clash with a file that already exists, that row says `Conflict` and is skipped. The rest still get renamed, and you get a summary at the end.

```powershell
.\rename-files.ps1 -Path .\docs -Prefix '2026-' -Filter *.md
.\rename-files.ps1 -Path .\docs -Prefix '2026-' -Filter *.md -Apply -WhatIf
.\rename-files.ps1 -Path .\docs -Prefix '2026-' -Filter *.md -Apply
```
