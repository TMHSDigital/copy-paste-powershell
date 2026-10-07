---
title: Zip a folder or files
cmdlet: Compress-Archive
aliases: []
category: files
difficulty: beginner
topics: [files, zip, backup]
command: Compress-Archive -Path .\docs -DestinationPath .\docs.zip
summary: Create a .zip file from a folder or a set of files.
module: Microsoft.PowerShell.Archive
platforms: [windows, linux, macos]
equivalents:
  bash: zip -r docs.zip docs
  cmd: tar -a -c -f docs.zip docs
notes:
  "5.1": Cannot add files larger than 2 GB. Use PowerShell 7 or another tool for big files.
---

Zips files or a whole folder. Passing a folder puts the folder itself inside the zip. Passing `.\docs\*` puts only its contents in.

## Common parameters

- `-DestinationPath` is the `.zip` to create.
- `-Update` adds or replaces files in an existing zip.
- `-Force` overwrites an existing zip.
- `-CompressionLevel Fastest` trades size for speed.

## Try this

```powershell
Compress-Archive -Path .\docs\*.md -DestinationPath .\markdown.zip -Force
```

Want a dated name like `docs-20260107-0930.zip`? Use the [zip builder](/builders/zip-folder/).
