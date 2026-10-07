---
title: Start a Windows service
cmdlet: Start-Service
aliases: [sasv]
category: system
difficulty: intermediate
topics: [service]
command: Start-Service -Name Spooler
featured: false
warning: Usually needs an elevated session. Starting the wrong service can have side effects.
summary: Start a stopped service. Often requires Administrator.
module: Microsoft.PowerShell.Management
platforms:
  - windows
admin: true
equivalents:
  bash: sudo systemctl start nginx
  cmd: net start Spooler
---

Starts a service. If access is denied, open PowerShell as Administrator.

## Try this

```powershell
Get-Service -Name Spooler | Start-Service -WhatIf
```
