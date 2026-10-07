---
title: Zip a folder with a date stamp
summary: Compress a folder into a dated .zip, for backups or sending to someone.
topics: [files, zip, backup]
fields:
  - name: source
    label: Folder to zip
    type: text
    required: true
    default: ".\\docs"
  - name: destination
    label: Save the .zip in
    type: text
    required: true
    default: ".\\archives"
  - name: name
    label: Zip name (date is added)
    type: text
    required: true
    default: "docs"
    explain: "The file is named like {value}-20260107-0930.zip, so older zips are never overwritten."
  - name: whatIf
    label: Preview only (-WhatIf)
    type: checkbox
    default: false
    explain: "-WhatIf prints what would be zipped without writing the file."
template: |
  $stamp = Get-Date -Format 'yyyyMMdd-HHmm'
  New-Item -ItemType Directory -Force -Path {{destination:q}} | Out-Null
  $zip = Join-Path -Path {{destination:q}} -ChildPath ({{name:q}} + '-' + $stamp + '.zip')
  Compress-Archive -LiteralPath {{source:q}} -DestinationPath $zip{{#whatIf}} -WhatIf{{/whatIf}}
  $zip
---

Creates the destination folder if it is missing, then writes one `.zip` that contains the folder. The last line prints where the zip went.

`Compress-Archive` cannot zip files larger than 2 GB on Windows PowerShell 5.1. For big folders, use PowerShell 7.
