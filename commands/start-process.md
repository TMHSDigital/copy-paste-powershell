---
title: Open a file or start a program
cmdlet: Start-Process
aliases: [start, saps]
category: system
difficulty: beginner
topics: [system, process, open]
command: Start-Process -FilePath notepad.exe -ArgumentList .\notes.txt
summary: Launch a program, or open a file or web address with its default app.
module: Microsoft.PowerShell.Management
platforms: [windows, linux, macos]
equivalents:
  bash: xdg-open notes.txt
  cmd: start notes.txt
notes:
  "7": On Linux and macOS, the start alias is not defined. Type Start-Process.
---

Starts a program in its own window. Point it at a document or a URL and it opens with the default app, like double-clicking.

## Common parameters

- `-ArgumentList` passes arguments to the program.
- `-Wait` waits until the program closes before PowerShell continues.
- `-Verb RunAs` asks Windows to run it as administrator (you get the UAC prompt).
- `-PassThru` returns the process, so you can check `.ExitCode` later.

## Try this

```powershell
Start-Process -FilePath .\report.pdf
Start-Process -FilePath 'https://learn.microsoft.com/powershell/'
Start-Process -FilePath powershell.exe -Verb RunAs
```
