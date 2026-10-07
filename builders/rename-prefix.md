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
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
    explain: "-WhatIf prints each rename without doing it."
template: |
  $prefix = {{prefix:q}}
  $suffix = {{suffix:q}}
  # Collect the list first so renamed files are not picked up a second time.
  $files = @(Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}}{{/filter}})
  foreach ($file in $files) {
      # Already renamed? Skip it, so running this twice is harmless.
      if ($file.BaseName.StartsWith($prefix) -and $file.BaseName.EndsWith($suffix)) { continue }
      $newName = $prefix + $file.BaseName + $suffix + $file.Extension
      Rename-Item -LiteralPath $file.FullName -NewName $newName{{#whatIf}} -WhatIf{{/whatIf}}
  }
---

Renames every matching file in that folder (not subfolders). Leave the suffix empty if you only want a prefix. Files that already have the prefix and suffix are skipped. If you want a preview table and conflict checks, use the [bulk rename script](/scripts/rename-files/) instead.
