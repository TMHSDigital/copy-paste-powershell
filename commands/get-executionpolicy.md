---
title: See whether scripts are allowed to run
cmdlet: Get-ExecutionPolicy
aliases: []
category: help
difficulty: beginner
topics: [help, security]
command: Get-ExecutionPolicy -List
featured: false
summary: Show the execution policy at each scope.
---

Tells you why a script might be blocked. `-List` shows every scope. MachinePolicy and UserPolicy come from Group Policy and win.

Read the execution policy guide before you change anything. `Set-ExecutionPolicy` is a separate, sharper tool.

## Try this

```powershell
Get-ExecutionPolicy -List
```
