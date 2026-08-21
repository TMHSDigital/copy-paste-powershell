---
title: Find files
summary: Build a Get-ChildItem command with extension, recurse, and name filters.
fields:
  - name: path
    label: Folder
    type: text
    default: ".\\docs"
    placeholder: ".\\docs"
  - name: filter
    label: Filter
    type: text
    default: "*.md"
    placeholder: "*.log"
    help: Wildcard PowerShell passes to -Filter. Fast, but limited compared to -Include.
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: true
  - name: filesOnly
    label: Files only
    type: checkbox
    default: true
template: |
  Get-ChildItem -Path "{{path}}" -Filter "{{filter}}"{{#recurse}} -Recurse{{/recurse}}{{#filesOnly}} -File{{/filesOnly}}
---

Lists matching files. Pipe into `Select-Object Name, Length` if you want a shorter table.
