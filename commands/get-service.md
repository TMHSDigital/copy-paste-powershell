---
title: List Windows services
cmdlet: Get-Service
aliases: [gsv]
category: system
difficulty: beginner
topics: [service]
command: "Get-Service | Where-Object Status -eq 'Running'"
featured: false
summary: See services and whether they are running.
module: Microsoft.PowerShell.Management
platforms:
  - windows
equivalents:
  bash: systemctl list-units --type=service --state=running
  cmd: sc query
---

Windows only. Lists services. `Status` is Running or Stopped. Some service names are not the display names. Use `-DisplayName '*print*'` when you do not know the short name.

## Try this

```powershell
Get-Service -Name Spooler
```
