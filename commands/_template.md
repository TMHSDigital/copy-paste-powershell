---
title: Short description of the task
cmdlet: Get-Something
aliases: [gs]
category: files
difficulty: beginner
topics: [files]
command: Get-Something -Path .\docs
summary: One sentence for search results and the page description.
module: Microsoft.PowerShell.Management
platforms: [windows, linux, macos]
featured: false
# Optional. Delete what you do not need.
# admin: true
# warning: One sentence shown in a yellow box above the explanation.
# minVersion: "7.0"
# notes:
#   "5.1": What is different on Windows PowerShell 5.1.
#   "7": What is different on PowerShell 7.
# equivalents:
#   bash: ls -la
#   cmd: dir
#   powershell: Get-ChildItem -Force   # if it differs from `command`
# output: |
#   What the command prints, trimmed to a few lines.
---

What this cmdlet does, in plain language.

## Common parameters

- `-Path` is the thing you point it at.

## Try this

```powershell
Get-Something -Path .\docs | Select-Object -First 5
```

<!--
module: the module from the Microsoft Learn URL, for example
  https://learn.microsoft.com/powershell/module/microsoft.powershell.management/get-childitem
  -> Microsoft.PowerShell.Management. The site builds the docs link from it.
platforms: where it works. Many cmdlets are Windows only (services, networking, event log).
-->
