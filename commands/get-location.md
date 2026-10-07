---
title: Show the current folder
cmdlet: Get-Location
aliases: [gl, pwd]
category: files
difficulty: beginner
topics: [files, navigation]
command: Get-Location
summary: Print the folder you are in. Relative paths like .\docs start from here.
module: Microsoft.PowerShell.Management
platforms: [windows, linux, macos]
equivalents:
  bash: pwd
  cmd: cd
---

Shows the current folder. Every relative path (`.\docs`, `..\backup`) is relative to this.

The prompt usually shows it too: `PS C:\Path\To\Folder>`. The automatic variable `$PWD` holds the same value.

## Try this

```powershell
Get-Location
Set-Location -Path ..
Get-Location
```

Jump somewhere and come back:

```powershell
Push-Location -Path $env:TEMP
Get-ChildItem
Pop-Location
```
