---
title: List files in a folder
cmdlet: Get-ChildItem
aliases: [gci, ls, dir]
category: files
difficulty: beginner
topics: [files, listing]
command: "Get-ChildItem -Path .\\docs"
featured: true
summary: "List files and folders at a path, like dir or ls."
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ls -la
  cmd: dir
  powershell: Get-ChildItem -Force
  note: "ls -la does not work: -Force is what shows hidden files."
notes:
  "7": On Linux and macOS, ls runs the system command instead of this cmdlet. Type the full cmdlet name there.
output: |2-
      Directory: C:\Path\To\docs

  Mode                 LastWriteTime         Length Name
  ----                 -------------         ------ ----
  d----          10/1/2026  9:12 AM                images
  -a---          10/3/2026  4:40 PM           2048 notes.txt
  -a---          10/5/2026 11:02 AM          18233 report.docx
---

Lists files and folders. Point `-Path` at a folder. Skip `-Path` and it uses the current directory.

## Common parameters

- `-Recurse` walks subfolders.
- `-File` or `-Directory` filters the type.
- `-Filter *.log` is the fast way to match a pattern.

## Try this

```powershell
Get-ChildItem -Path .\docs -Recurse -File -Filter *.md
```
