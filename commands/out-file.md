---
title: Send output to a file
cmdlet: Out-File
aliases: []
category: files
difficulty: beginner
topics: [files, text]
command: "Get-ChildItem | Out-File -FilePath .\\listing.txt"
featured: false
summary: Write pipeline output to a text file.
---

Redirects formatted output to a file. Good for logs and quick dumps. For structured data, use `Export-Csv` or `ConvertTo-Json`.

`-Append` adds instead of replacing. `>` is an alias for `Out-File`. `>>` appends.

## Try this

```powershell
Get-Date | Out-File -FilePath .\run.log -Append
```
