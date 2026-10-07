---
title: Copy or move files
summary: Generate a Copy-Item or Move-Item command from a short form.
topics: [files, copy, move]
fields:
  - name: action
    label: Action
    type: select
    default: Copy-Item
    options:
      - { value: Copy-Item, label: Copy, explain: "Copy-Item copies. The source stays where it is." }
      - { value: Move-Item, label: Move, explain: "Move-Item moves. The source is gone afterwards." }
  - name: source
    label: Source file or folder
    type: text
    required: true
    default: ".\\docs"
    placeholder: ".\\docs"
    help: The exact name. Wildcards like *.txt are not expanded here; use the Find files builder for those.
    explain: "-LiteralPath uses the source name exactly as typed, even if it contains [ ] or other special characters."
  - name: destination
    label: Destination
    type: text
    required: true
    default: ".\\backup"
    placeholder: ".\\backup"
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
    explain: "-Recurse copies everything inside the folder, not just the folder itself."
  - name: whatIf
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
    explain: "-WhatIf only prints what would happen. Nothing is copied or moved until you remove it."
template: |
  {{action}} -LiteralPath {{source:q}} -Destination {{destination:q}}{{#recurse}} -Recurse{{/recurse}}{{#whatIf}} -WhatIf{{/whatIf}}
---

Pick copy or move, fill in the paths, and keep `-WhatIf` on until the preview looks right. Move deletes the source.
