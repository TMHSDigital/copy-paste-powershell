---
title: Create a file or folder
cmdlet: New-Item
aliases: [ni]
category: files
difficulty: beginner
topics: [files, create]
command: "New-Item -Path .\\docs -ItemType Directory"
featured: false
summary: "Create a new file, folder, or other item."
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: mkdir -p docs
  cmd: mkdir docs
---

Creates files and folders. `-ItemType Directory` makes a folder. `-ItemType File` makes a file. `-Force` creates missing parents for files in some versions; prefer creating the folder first.

## Try this

```powershell
New-Item -Path .\docs\readme.txt -ItemType File
```
