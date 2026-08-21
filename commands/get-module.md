---
title: See loaded and available modules
cmdlet: Get-Module
aliases: [gmo]
category: help
difficulty: beginner
topics: [help, modules]
command: Get-Module -ListAvailable
featured: false
summary: "What modules are loaded, or what is installed."
---

No parameters: currently imported. `-ListAvailable`: installed on disk. Import with `Import-Module`.

## Try this

```powershell
Get-Module -ListAvailable | Select-Object Name, Version
```
