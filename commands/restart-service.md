---
title: Restart a Windows service
cmdlet: Restart-Service
aliases: []
category: system
difficulty: intermediate
topics: [system, services]
command: Restart-Service -Name Spooler -WhatIf
summary: Stop and start a service in one step, the classic fix for a stuck print queue.
module: Microsoft.PowerShell.Management
platforms: [windows]
admin: true
equivalents:
  bash: sudo systemctl restart nginx
  cmd: net stop Spooler && net start Spooler
---

Stops a service and starts it again. Needs PowerShell opened as administrator.

The example restarts the Print Spooler, which clears many "stuck print job" problems. Remove `-WhatIf` to do it for real.

`-Name` is the short service name. `Get-Service -DisplayName '*print*'` finds it from the friendly name.

## Try this

```powershell
Get-Service -Name Spooler
Restart-Service -Name Spooler -WhatIf
```

If other services depend on it, add `-Force`.
