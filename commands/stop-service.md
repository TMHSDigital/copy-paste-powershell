---
title: Stop a Windows service
cmdlet: Stop-Service
aliases: [spsv]
category: system
difficulty: intermediate
topics: [service]
command: Stop-Service -Name Spooler -WhatIf
featured: false
warning: Stopping a service other processes depend on will hurt. Use -WhatIf.
summary: Stop a running service. Often requires Administrator.
module: Microsoft.PowerShell.Management
platforms:
  - windows
admin: true
equivalents:
  bash: sudo systemctl stop nginx
  cmd: net stop Spooler
---

`-Force` also stops dependents. That is a sharp edge. Look at dependents first: `Get-Service -Name Spooler | Select-Object -ExpandProperty DependentServices`.

## Try this

```powershell
Stop-Service -Name Spooler -WhatIf
```
