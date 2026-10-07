---
title: Read a text file
cmdlet: Get-Content
aliases: [gc, cat, type]
category: files
difficulty: beginner
topics: [files, text]
command: "Get-Content -Path .\\notes.txt"
featured: true
summary: Read the lines of a text file.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: cat notes.txt
  cmd: type notes.txt
notes:
  "7": On Linux and macOS, cat runs the system command instead of this cmdlet. Type the full cmdlet name there.
output: |-
  Buy milk
  Call the printer company
  Back up the laptop on Friday
---

Reads a file as an array of lines. `-TotalCount 20` is the first 20 lines. `-Tail 20` is the last 20.

Do not use this on huge binaries. For CSV, prefer `Import-Csv`.

## Try this

```powershell
Get-Content -Path .\notes.txt -Tail 10
```
