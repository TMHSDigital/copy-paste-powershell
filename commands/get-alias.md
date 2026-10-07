---
title: List command aliases
cmdlet: Get-Alias
aliases: [gal]
category: help
difficulty: beginner
topics: [help, alias]
command: Get-Alias -Name gci
featured: false
summary: "See that gci is Get-ChildItem, and other shortcuts."
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: alias
  powershell: Get-Alias
---

Aliases are shortcuts. Fine in the shell. In scripts, write the real cmdlet name so the next human can read it.

## Try this

```powershell
Get-Alias | Where-Object Definition -eq 'Get-ChildItem'
```
