---
title: Read item properties
cmdlet: Get-ItemProperty
aliases: [gp]
category: files
difficulty: intermediate
topics: [files, registry]
command: "Get-ItemProperty -Path .\\notes.txt"
featured: false
summary: "Read properties of a file, or values from the registry."
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
---

On the file system this looks a lot like `Get-Item`. On the registry it reads values under a key. Beginners mostly meet it in registry examples. Stay out of `HKLM:\SAM` and similar.

## Try this

```powershell
Get-ItemProperty -Path .\notes.txt | Select-Object Name, Length, LastWriteTime
```
