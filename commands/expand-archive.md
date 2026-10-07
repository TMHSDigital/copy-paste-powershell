---
title: Unzip a file
cmdlet: Expand-Archive
aliases: []
category: files
difficulty: beginner
topics: [files, zip]
command: Expand-Archive -Path .\docs.zip -DestinationPath .\docs-unzipped
summary: Extract a .zip into a folder.
module: Microsoft.PowerShell.Archive
platforms: [windows, linux, macos]
equivalents:
  bash: unzip docs.zip -d docs-unzipped
  cmd: tar -x -f docs.zip -C docs-unzipped
---

Extracts every file in a zip into the destination folder. The folder is created if it does not exist.

If a file is already there, the command stops with an error. Add `-Force` to overwrite.

Downloaded zips carry the "from the internet" mark, and so do the files inside them. If a script from the zip will not run, see [Unblock-File](/commands/unblock-file/).

## Try this

```powershell
Expand-Archive -Path .\docs.zip -DestinationPath .\docs-unzipped -Force
Get-ChildItem -Path .\docs-unzipped -Recurse
```
