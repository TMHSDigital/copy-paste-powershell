---
title: See properties and methods on an object
cmdlet: Get-Member
aliases: [gm]
category: help
difficulty: beginner
topics: [help, objects]
command: "Get-ChildItem | Get-Member"
featured: false
summary: Ask an object what it can do. The most important discovery tool after Get-Help.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
---

Pipe anything into `Get-Member` to see property and method names. That is how you stop guessing.

## Try this

```powershell
Get-Date | Get-Member
'hello' | Get-Member
```
