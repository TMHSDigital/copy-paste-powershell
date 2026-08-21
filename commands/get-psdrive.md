---
title: List drives PowerShell can see
cmdlet: Get-PSDrive
aliases: [gdr]
category: system
difficulty: beginner
topics: [drives]
command: Get-PSDrive
featured: false
summary: "File drives, plus Env, HKCU, HKLM, Variable, and others."
---

PowerShell drives are not just C:. `Env:` is environment variables. `HKCU:` is the current-user registry. `Variable:` is in-memory variables.

## Try this

```powershell
Get-PSDrive -PSProvider FileSystem
Get-ChildItem Env:TEMP
```
