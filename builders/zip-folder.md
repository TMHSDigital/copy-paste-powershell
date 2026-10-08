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
    label: Preview only (writes nothing)
    type: checkbox
    default: false
    explain: "Preview mode prints where the zip would go and how many files it would hold. Nothing is created."
template: |
  $stamp = Get-Date -Format 'yyyyMMdd-HHmm'
  $zip = Join-Path -Path {{destination:q}} -ChildPath ({{name:q}} + '-' + $stamp + '.zip')
  {{#whatIf}}# Preview only: nothing is created. Untick "Preview only" to write the zip.
  'Would write {0} with {1} file(s).' -f $zip, @(Get-ChildItem -LiteralPath {{source:q}} -Recurse -File).Count{{/whatIf}}{{^whatIf}}New-Item -ItemType Directory -Force -Path {{destination:q}} | Out-Null
  # -DestinationPath reads [ ] as wildcards, so escape them.
  Compress-Archive -LiteralPath {{source:q}} -DestinationPath ([WildcardPattern]::Escape($zip))
  $zip{{/whatIf}}
---

Creates the destination folder if it is missing, then writes one `.zip` that contains the folder. The last line prints where the zip went.

`Compress-Archive` cannot add files larger than 2 GB, in Windows PowerShell 5.1 and PowerShell 7 alike, and it skips hidden files. For folders with big files, use `tar.exe -a -c -f .\archive.zip .\folder`, which is built into Windows 10 and 11.
