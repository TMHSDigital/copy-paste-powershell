---
title: Copy output to the clipboard
cmdlet: Set-Clipboard
aliases: [scb]
category: text
difficulty: beginner
topics: [text, clipboard]
command: Get-ChildItem -Name | Set-Clipboard
summary: Put text or command output on the clipboard, ready to paste into email or Excel.
module: Microsoft.PowerShell.Management
platforms: [windows, linux, macos]
equivalents:
  bash: ls | pbcopy
  cmd: dir /b | clip
notes:
  "7": Works on Linux (needs xclip) and macOS as well as Windows.
---

Sends whatever comes down the pipeline to the clipboard. Paste it anywhere with Ctrl+V.

Objects are turned into text first. For a tidy table that pastes into Excel as columns, convert to tab-separated text:

## Try this

```powershell
Get-Process |
    Select-Object -First 10 Name, Id, CPU |
    ConvertTo-Csv -Delimiter "`t" -NoTypeInformation |
    Set-Clipboard
```

`-Append` adds to what is already on the clipboard.
