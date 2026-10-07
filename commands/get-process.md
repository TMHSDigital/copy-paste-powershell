---
title: List running processes
cmdlet: Get-Process
aliases: [gps, ps]
category: system
difficulty: beginner
topics: [process]
command: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10"
featured: true
summary: "See what is running, with CPU and memory."
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: ps aux --sort=-%cpu | head
  cmd: tasklist
notes:
  "7": On Linux and macOS, ps runs the system command instead of this cmdlet. Type the full cmdlet name there.
output: |2-
   NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName
   ------    -----      -----     ------      --  -- -----------
      112   412.30     398.15     812.45    9876   1 chrome
       78   190.02     212.60     301.10    4412   1 Teams
       45    96.44     120.81     120.32    7720   1 explorer
       32    60.18      75.03      44.07    2210   1 OUTLOOK
---

Lists processes. `-Name pwsh` filters by name (no `.exe`). WorkingSet is memory in bytes.

## Try this

```powershell
Get-Process -Name explorer | Format-List *
```
