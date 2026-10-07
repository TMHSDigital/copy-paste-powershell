---
title: Browse and filter results in a window
cmdlet: Out-GridView
aliases: [ogv]
category: text
difficulty: beginner
topics: [text, output, filter]
command: Get-Process | Out-GridView
summary: Open results in a sortable, filterable window, or pick rows and pass them on.
module: Microsoft.PowerShell.Utility
platforms: [windows]
notes:
  "7": Built in on Windows. On Linux and macOS, install the Microsoft.PowerShell.ConsoleGuiTools module and use Out-ConsoleGridView instead.
---

Opens a window with your results as a table. Click a column to sort, or type in the filter box. Nothing in the pipeline is changed.

## Pick rows and keep going

With `-PassThru`, the rows you select and confirm with **OK** continue down the pipeline. That turns it into a simple picker:

```powershell
Get-Service | Where-Object Status -eq 'Running' | Out-GridView -PassThru | Restart-Service -WhatIf
```

`-Title` sets the window title. `-OutputMode Single` allows only one choice.

## Try this

```powershell
Get-ChildItem -Path .\docs -Recurse -File | Select-Object Name, Length, LastWriteTime | Out-GridView -Title 'Files in docs'
```
