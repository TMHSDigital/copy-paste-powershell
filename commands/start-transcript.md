---
title: Record the session to a log file
cmdlet: Start-Transcript
aliases: []
category: system
difficulty: beginner
topics: [logging]
command: "Start-Transcript -Path (Join-Path $env:TEMP 'ps-transcript.txt')"
featured: false
summary: Write everything in the console to a text file until you stop it.
module: Microsoft.PowerShell.Host
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: script session.log
---

Logs input and output. Stop with `Stop-Transcript`. Put the file in `$env:TEMP` or a folder you chose. Do not log secrets. The companion script in this repo wraps a safer path.

## Try this

```powershell
Start-Transcript -Path (Join-Path $env:TEMP 'ps-transcript.txt')
Get-Date
Stop-Transcript
```
