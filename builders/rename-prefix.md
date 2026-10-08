---
title: Rename with prefix or suffix
summary: Generate a rename loop that is safe to run twice. Preview uses -WhatIf.
topics: [files, rename]
fields:
  - name: path
    label: Folder
    type: text
    required: true
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
    safety: true
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
    explain: "-WhatIf prints each rename without doing it."
template: |
  $prefix = {{prefix:q}}
  $suffix = {{suffix:q}}
  # Collect the list first so renamed files are not picked up a second time.
  # -like double-checks the name: in Windows PowerShell 5.1, -Filter *.htm also matches .html files.
  $files = @(Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}} | Where-Object Name -like {{filter:q}}{{/filter}})
  foreach ($file in $files) {
      # Add only what is missing, so running this twice is harmless.
      $newBase = $file.BaseName
      if (-not $newBase.StartsWith($prefix, 'OrdinalIgnoreCase')) { $newBase = $prefix + $newBase }
      if (-not $newBase.EndsWith($suffix, 'OrdinalIgnoreCase')) { $newBase = $newBase + $suffix }
      if ($newBase -eq $file.BaseName) { 'Skipped (already has the prefix and suffix): {0}' -f $file.Name; continue }
      Rename-Item -LiteralPath $file.FullName -NewName ($newBase + $file.Extension){{#whatIf}} -WhatIf{{/whatIf}}
  }
---

Renames every matching file in that folder (not subfolders). Leave the suffix empty if you only want a prefix. Only the missing part is added: a file that already starts with the prefix only gets the suffix, and a file that has both is left alone. If you want a preview table and conflict checks, use the [bulk rename script](/scripts/rename-files/) instead.
