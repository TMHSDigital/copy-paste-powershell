---
title: Builder title
summary: One sentence.
fields:
  - name: path
    label: Path
    type: text
    default: ".\\docs"
    placeholder: ".\\docs"
    help: Use a placeholder path, not a real user folder.
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
template: |
  Get-ChildItem -Path "{{path}}"{{#recurse}} -Recurse{{/recurse}}
---

Explain what the generated command does. The form above is defined in frontmatter. The site picks up any new file in `builders/`.
