---
title: Find and replace text in files
summary: List every file that contains some text, then replace it once the list looks right.
topics: [text, files, replace]
fields:
  - name: path
    label: Folder
    type: text
    required: true
    default: ".\\docs"
  - name: filter
    label: Files to search
    type: text
    default: "*.txt"
    placeholder: "*.md"
  - name: recurse
    label: Include subfolders
    type: checkbox
    default: false
    explain: "-Recurse searches files in subfolders too."
  - name: find
    label: Find
    type: text
    required: true
    default: "old text"
    help: Exact text, case-sensitive. Not a wildcard or regex.
  - name: replace
    label: Replace with
    type: text
    default: "new text"
  - name: apply
    label: Write the changes (leave off to just list matches)
    type: checkbox
    default: false
    explain: "Changed files are saved as UTF-8. Make a backup first; there is no undo."
    explainOff: "Preview mode: nothing is changed. Each line shows a file and how many times the text appears."
template: |
  $find = {{find:q}}
  $replace = {{replace:q}}
  $files = Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}}{{/filter}}{{#recurse}} -Recurse{{/recurse}}
  foreach ($file in $files) {
      $text = [System.IO.File]::ReadAllText($file.FullName)
      if (-not $text.Contains($find)) { continue }
  {{^apply}}    '{0}: {1} match(es)' -f $file.FullName, ([regex]::Matches($text, [regex]::Escape($find))).Count{{/apply}}{{#apply}}    [System.IO.File]::WriteAllText($file.FullName, $text.Replace($find, $replace))
      'Updated {0}' -f $file.FullName{{/apply}}
  }
---

Run it once with **Write the changes** off. You get a list of files and match counts. When the list looks right, tick the box, copy the new script, and run it again.

Matching is exact and case-sensitive. `Cat` does not match `cat`.
