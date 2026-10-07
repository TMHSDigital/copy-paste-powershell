---
title: ForEach over files
summary: List files, then run one action per file.
topics: [files, loops]
fields:
  - name: path
    label: Folder
    type: text
    required: true
    default: ".\\docs"
  - name: filter
    label: Filter
    type: text
    default: "*.log"
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
    explain: "-Recurse includes files in subfolders."
  - name: action
    label: Action
    type: select
    default: name
    options:
      - { value: name, label: Print each file name, explain: "$_ is the current file inside ForEach-Object. $_.Name is its name." }
      - { value: length, label: Print name and size, explain: "$_.Length is the size in bytes. '{0}  {1}' -f fills in the blanks in order." }
      - { value: lastwrite, label: Print name and last write time, explain: "$_.LastWriteTime is when the file was last saved." }
template: |
  Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}}{{/filter}}{{#recurse}} -Recurse{{/recurse}} | ForEach-Object {
  {{#action_name}}    $_.Name{{/action_name}}{{#action_length}}    '{0}  {1}' -f $_.Name, $_.Length{{/action_length}}{{#action_lastwrite}}    '{0}  {1}' -f $_.Name, $_.LastWriteTime{{/action_lastwrite}}
  }
---

A starting point for "do this to every matching file." Replace the `ForEach-Object` body with `Copy-Item`, `Remove-Item -WhatIf`, or anything else. Read it before you run it.
