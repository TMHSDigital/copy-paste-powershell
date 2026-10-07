---
title: Find files
summary: Build a Get-ChildItem command with extension, recurse, and name filters.
topics: [files, search]
fields:
  - name: path
    label: Folder
    type: text
    required: true
    default: ".\\docs"
    placeholder: ".\\docs"
  - name: filter
    label: Filter
    type: text
    default: "*.md"
    placeholder: "*.log"
    help: Wildcard PowerShell passes to -Filter. Fast, but limited compared to -Include.
    explain: "-Filter {value} keeps only names that match the pattern. * means any characters."
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: true
    explain: "-Recurse looks inside every subfolder too."
  - name: filesOnly
    label: Files only
    type: checkbox
    default: true
    explain: "-File leaves folders out of the results."
template: |
  Get-ChildItem -LiteralPath {{path:q}}{{#filter}} -Filter {{filter:q}}{{/filter}}{{#recurse}} -Recurse{{/recurse}}{{#filesOnly}} -File{{/filesOnly}}
---

Lists matching files. Pipe into `Select-Object Name, Length` if you want a shorter table.
