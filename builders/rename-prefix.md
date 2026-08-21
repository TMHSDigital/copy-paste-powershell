---
title: Rename with prefix or suffix
summary: Generate a ForEach-Object rename loop. Preview uses -WhatIf.
fields:
  - name: path
    label: Folder
    type: text
    default: ".\\docs"
  - name: filter
    label: Filter
    type: text
    default: "*.txt"
  - name: prefix
    label: Prefix
    type: text
    default: "draft-"
    placeholder: "2026-"
  - name: suffix
    label: Suffix (before extension)
    type: text
    default: ""
    placeholder: "-final"
  - name: whatIf
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
template: |
  Get-ChildItem -Path "{{path}}" -File -Filter "{{filter}}" | ForEach-Object {
      $newName = '{{prefix}}' + $_.BaseName + '{{suffix}}' + $_.Extension
      Rename-Item -LiteralPath $_.FullName -NewName $newName{{#whatIf}} -WhatIf{{/whatIf}}
  }
---

Renames every matching file in that folder (not subfolders). Leave suffix empty if you only want a prefix. Prefer the `rename-files` script if you want a dry-run table first.
