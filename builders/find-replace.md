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
    explain: "Changed files are saved in the same encoding they had. Make a backup first; there is no undo."
    explainOff: "Preview mode: nothing is changed. Each line shows a file and how many times the text appears."
template: |
  $find = {{find:q}}
  $replace = {{replace:q}}
  $files = Get-ChildItem -LiteralPath {{path:q}} -File{{#filter}} -Filter {{filter:q}}{{/filter}}{{#recurse}} -Recurse{{/recurse}}{{#filter}} |
      Where-Object Name -like {{filter:q}}{{/filter}}
  # Read strictly as UTF-8 (or UTF-16 when the file starts with a marker), so a
  # file saved some other way is skipped instead of damaged.
  $strictUtf8 = New-Object System.Text.UTF8Encoding($false, $true)
  foreach ($file in $files) {
      $reader = New-Object System.IO.StreamReader($file.FullName, $strictUtf8, $true)
      try {
          $text = $reader.ReadToEnd()
          $encoding = $reader.CurrentEncoding
      } catch {
          'Skipped (not UTF-8 or UTF-16 text): {0}' -f $file.FullName
          continue
      } finally {
          $reader.Dispose()
      }
      if (-not $text.Contains($find)) { continue }
  {{^apply}}    '{0}: {1} match(es)' -f $file.FullName, ([regex]::Matches($text, [regex]::Escape($find))).Count{{/apply}}{{#apply}}    # Save it back the same way it was saved before.
      [System.IO.File]::WriteAllText($file.FullName, $text.Replace($find, $replace), $encoding)
      'Updated {0}' -f $file.FullName{{/apply}}
  }
---

Run it once with **Write the changes** off. You get a list of files and match counts. When the list looks right, tick the box, copy the new script, and run it again.

Matching is exact and case-sensitive. `Cat` does not match `cat`.

Files are read as UTF-8 or UTF-16 and saved back the same way, byte-order mark included. A file saved in an older Windows encoding (often called ANSI), or a file that is not text at all, is listed as **Skipped** and left alone, because rewriting it could garble letters like é or ü. To include such a file, open it in Notepad, choose **Save as**, pick **UTF-8**, and run the script again.
