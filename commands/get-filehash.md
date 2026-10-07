---
title: Check a file's hash (checksum)
cmdlet: Get-FileHash
aliases: []
category: files
difficulty: beginner
topics: [files, security, download, hash]
command: Get-FileHash -Path .\installer.exe -Algorithm SHA256
summary: Compute a SHA256 checksum to confirm a download is not corrupted or tampered with.
module: Microsoft.PowerShell.Utility
platforms: [windows, linux, macos]
equivalents:
  bash: sha256sum installer.exe
  cmd: certutil -hashfile installer.exe SHA256
---

Download pages often publish a SHA256 "checksum." If your file's hash matches, you have exactly the file they published.

SHA256 is the default. You can also pass `-Algorithm SHA1`, `SHA384`, `SHA512`, or `MD5`, but only for matching an old published value; MD5 and SHA1 are not safe against tampering.

## Try this

Compare against the published value. `-eq` ignores case, so upper or lower case both work:

```powershell
$expected = 'PASTE-THE-PUBLISHED-HASH-HERE'
(Get-FileHash -Path .\installer.exe).Hash -eq $expected
```

`True` means it matches.

Find duplicate files by content:

```powershell
Get-ChildItem -Path .\photos -File -Recurse |
    Get-FileHash |
    Group-Object -Property Hash |
    Where-Object Count -gt 1
```
