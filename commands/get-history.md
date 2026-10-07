---
title: See commands you ran earlier
cmdlet: Get-History
aliases: [h, history, ghy]
category: help
difficulty: beginner
topics: [help, history]
command: Get-History -Count 20
summary: List the commands typed in this window, so you can rerun or save them.
module: Microsoft.PowerShell.Core
platforms: [windows, linux, macos]
equivalents:
  bash: history 20
  cmd: doskey /history
---

Shows what you typed in the current window. Each entry has an `Id`. `Invoke-History 12` (alias `r 12`) runs entry 12 again.

`Get-History` forgets everything when you close the window. PSReadLine keeps a longer history in a file across sessions. Press Ctrl+R at the prompt to search it.

## Try this

Save this session's commands to a script to tidy up later:

```powershell
Get-History | Select-Object -ExpandProperty CommandLine | Set-Content -Path .\what-i-did.ps1
```

Where the long-term history file lives:

```powershell
(Get-PSReadLineOption).HistorySavePath
```
