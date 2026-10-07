---
title: Summarize this computer
cmdlet: Get-ComputerInfo
aliases: []
category: system
difficulty: beginner
topics: [system]
command: "Get-ComputerInfo | Select-Object CsName, WindowsVersion, OsArchitecture"
featured: false
summary: "OS name, version, memory, and other machine facts."
module: Microsoft.PowerShell.Management
platforms:
  - windows
equivalents:
  bash: uname -a
  cmd: systeminfo
---

A large object. Select the properties you care about. Can be slow the first time.

## Try this

```powershell
Get-ComputerInfo | Select-Object CsName, OsName, OsHardwareAbstractionLayer
```
