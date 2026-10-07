---
title: Find a cmdlet by name
cmdlet: Get-Command
aliases: [gcm]
category: help
difficulty: beginner
topics: [help, discovery]
command: "Get-Command -Name *Item"
featured: false
summary: Search installed commands by name or verb.
module: Microsoft.PowerShell.Core
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: which git
  cmd: where git
  powershell: Get-Command git
---

Discovery. Wildcards work. `-Verb Get` lists Get-* commands. `-Noun Service` lists *-Service.

## Try this

```powershell
Get-Command -Verb Get -Noun Content
```
