---
title: Builder title
summary: One sentence.
topics: [files]
fields:
  - name: path
    label: Path
    type: text
    required: true
    default: ".\\docs"
    placeholder: ".\\docs"
    help: Use a placeholder path, not a real user folder.
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
    explain: "-Recurse includes subfolders."
template: |
  Get-ChildItem -LiteralPath {{path:q}}{{#recurse}} -Recurse{{/recurse}}
---

Explain what the generated command does. The form above is defined in frontmatter. The site picks up any new file in `builders/`.

Field types: `text`, `number` (with `min` and `max`), `time` (HH:MM), `checkbox`, `select` (with `options`). Add `safety: true` to a checkbox that keeps the script in preview mode (such as **Preview only (-WhatIf)**): a shared link can then never switch it off. Add `required: true` to a field that must be filled in, or `requiredWhen: { other: value }` (or a list of values) when it only matters for some choices, for example `requiredWhen: { frequency: [daily, weekly] }` or `requiredWhen: { tcp: true }`.

Template rules:

- `{{name:q}}` inserts a text value as a single-quoted PowerShell string. **Always use this for text fields.** It stops `$`, quotes, and backticks from breaking the script. `npm run validate` fails if a text field is used without `:q`.
- `{{name}}` inserts a value raw. Only use it for `select`, `number`, and `time` fields, which are validated in the browser.
- `{{#name}}...{{/name}}` is included when a checkbox is on or a text field is not empty. `{{^name}}...{{/name}}` is the opposite. Sections can nest when their names differ.
- A select also sets one `{{#name_value}}` flag per option.
- Add `explain:` to a field (or to a select option) to show a plain-English line under the preview. `{value}` in it is replaced with the field value. `explainOff:` on a checkbox shows when it is unchecked.
