---
title: Query system details (WMI/CIM)
cmdlet: Get-CimInstance
aliases: [gcim]
category: system
difficulty: intermediate
topics: [system, inventory, hardware]
command: Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime
summary: Ask Windows about hardware, the OS, installed updates, and more.
module: CimCmdlets
platforms: [windows]
equivalents:
  cmd: wmic os get caption,version,lastbootuptime
---

CIM (the modern face of WMI) is Windows' built-in database of system facts: serial numbers, BIOS, disks, uptime, installed updates. `Get-CimInstance` reads it.

It replaces `Get-WmiObject`, which was removed in PowerShell 7. The old `wmic` tool is being removed from Windows too.

## Try this

```powershell
Get-CimInstance -ClassName Win32_BIOS | Select-Object Manufacturer, SerialNumber
Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object Manufacturer, Model, TotalPhysicalMemory
Get-CimInstance -ClassName Win32_QuickFixEngineering | Sort-Object InstalledOn -Descending | Select-Object -First 5
```

`LastBootUpTime` from the first example tells you how long since the last restart.
