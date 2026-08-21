---
title: Overwrite a text file
cmdlet: Set-Content
aliases: [sc]
category: files
difficulty: beginner
topics: [files, text]
command: "Set-Content -Path .\\notes.txt -Value 'Hello'"
featured: false
warning: Set-Content replaces the whole file.
summary: "Write text to a file, replacing whatever was there."
---

Writes new content and wipes the old. Use `Add-Content` to append. On Windows PowerShell 5.1 the default encoding is often not UTF-8. PowerShell 7 writes UTF-8.

## Try this

```powershell
Set-Content -Path .\notes.txt -Value 'Hello' -WhatIf
```
