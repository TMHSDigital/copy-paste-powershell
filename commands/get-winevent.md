---
title: Read the Windows event log
cmdlet: Get-WinEvent
aliases: []
category: system
difficulty: intermediate
topics: [system, logs, troubleshooting]
command: Get-WinEvent -LogName System -MaxEvents 20
summary: Show recent entries from the System, Application, or other event logs.
module: Microsoft.PowerShell.Diagnostics
platforms: [windows]
equivalents:
  bash: journalctl -p err -n 20
---

The event log is where Windows records crashes, failed updates, unexpected shutdowns, and service errors. `Get-WinEvent` reads it without opening Event Viewer.

The **Security** log needs an administrator window. **System** and **Application** do not.

## Common parameters

- `-LogName System` or `Application`. `Get-WinEvent -ListLog *` lists them all.
- `-MaxEvents 20` keeps it short. Newest come first.
- `-FilterHashtable` filters fast by level, ID, or time.

## Try this

Errors (level 2) from the last 24 hours:

```powershell
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Level = 2; StartTime = (Get-Date).AddDays(-1) } |
    Select-Object TimeCreated, Id, ProviderName, Message
```

Why did the PC restart? Event 1074 records who or what asked for it:

```powershell
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Id = 1074 } -MaxEvents 5 |
    Format-List TimeCreated, Message
```

Windows PowerShell 5.1 also has the older `Get-EventLog`. It was removed in PowerShell 7, so learn `Get-WinEvent`.
