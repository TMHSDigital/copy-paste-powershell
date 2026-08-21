---
title: ForEach over files
summary: List files, then run one action per file.
fields:
  - name: path
    label: Folder
    type: text
    default: ".\\docs"
  - name: filter
    label: Filter
    type: text
    default: "*.log"
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
  - name: action
    label: Action
    type: select
    default: name
    options:
      - { value: name, label: Print each file name }
      - { value: length, label: Print name and size }
      - { value: lastwrite, label: Print name and last write time }
template: |
  Get-ChildItem -Path "{{path}}" -File -Filter "{{filter}}"{{#recurse}} -Recurse{{/recurse}} | ForEach-Object {
  {{#action_name}}    $_.Name{{/action_name}}{{#action_length}}    '{0}  {1}' -f $_.Name, $_.Length{{/action_length}}{{#action_lastwrite}}    '{0}  {1}' -f $_.Name, $_.LastWriteTime{{/action_lastwrite}}
  }
---

Starting point for "do this to every matching file." Replace the `ForEach-Object` body with `Copy-Item`, `Remove-Item -WhatIf`, or anything else. Read it before you run it.
