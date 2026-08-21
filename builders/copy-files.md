---
title: Copy or move files
summary: Generate a Copy-Item or Move-Item command from a short form.
fields:
  - name: action
    label: Action
    type: select
    default: Copy-Item
    options:
      - { value: Copy-Item, label: Copy }
      - { value: Move-Item, label: Move }
  - name: source
    label: Source
    type: text
    default: ".\\docs"
    placeholder: ".\\docs"
  - name: destination
    label: Destination
    type: text
    default: ".\\backup"
    placeholder: ".\\backup"
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
  - name: whatIf
    label: Preview only (-WhatIf)
    type: checkbox
    default: true
template: |
  {{action}} -Path "{{source}}" -Destination "{{destination}}"{{#recurse}} -Recurse{{/recurse}}{{#whatIf}} -WhatIf{{/whatIf}}
---

Pick copy or move, fill in placeholder paths, keep `-WhatIf` on until the preview looks right. Move deletes the source.
