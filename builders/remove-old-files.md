---
title: Delete files older than N days
summary: Build a cleanup command for logs, downloads, or temp folders. Preview first.
topics: [files, delete, cleanup]
fields:
  - name: path
    label: Folder
    type: text
    required: true
    default: ".\\logs"
  - name: filter
    label: Files to match
    type: text
    default: "*.log"
  - name: days
    label: Older than (days)
    type: number
    min: 1
    max: 36500
    default: "30"
    explain: "Only files last saved more than {value} day(s) ago are deleted."
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
    explain: "-Recurse also cleans files in subfolders."
  - name: whatIf
    safety: true
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
    explain: "-WhatIf lists what would be deleted. Untick it only when the list looks right."
    explainOff: "This deletes files for real. There is no recycle bin."
template: |
  $cutoff = (Get-Date).AddDays(-{{days}})
  # -like double-checks the name: in Windows PowerShell 5.1, -Filter *.htm also matches .html files.
  Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}}{{/filter}}{{#recurse}} -Recurse{{/recurse}} |
      Where-Object { $_.LastWriteTime -lt $cutoff{{#filter}} -and $_.Name -like {{filter:q}}{{/filter}} } |
      Remove-Item{{#whatIf}} -WhatIf{{/whatIf}}
---

Deleted files do not go to the recycle bin. Keep **Preview only** on for the first run. If you want a preview table and a count, use the [remove old files script](/scripts/remove-old-files/) instead.
