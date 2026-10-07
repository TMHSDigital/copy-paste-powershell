---
title: Append text to a file
cmdlet: Add-Content
aliases: [ac]
category: files
difficulty: beginner
topics: [files, text]
command: "Add-Content -Path .\\notes.txt -Value 'Another line'"
featured: false
summary: Add lines to the end of a text file.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: echo 'Another line' >> notes.txt
  cmd: echo Another line>> notes.txt
---

Appends without deleting existing lines. Creates the file if it does not exist.

## Try this

```powershell
Add-Content -Path .\notes.txt -Value (Get-Date)
```
