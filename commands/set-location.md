---
title: Change the current directory
cmdlet: Set-Location
aliases: [cd, sl, chdir]
category: files
difficulty: beginner
topics: [files, navigation]
command: "Set-Location -Path .\\docs"
featured: false
summary: Move the prompt into another folder.
---

Changes the working directory for the rest of the session. Same idea as `cd`.

`Set-Location ..` goes up one folder. `Set-Location -` (PowerShell 6+) goes back.

## Try this

```powershell
Set-Location -Path $env:TEMP
Get-Location
```
