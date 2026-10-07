---
title: Time how long a command takes
cmdlet: Measure-Command
aliases: []
category: system
difficulty: beginner
topics: [system, performance]
command: Measure-Command { Get-ChildItem -Path .\docs -Recurse }
summary: Run a command and report how long it took.
module: Microsoft.PowerShell.Utility
platforms: [windows, linux, macos]
equivalents:
  bash: time ls -R docs
---

Runs the script block and returns a `TimeSpan`. The command's own output is hidden; you only get the timing.

## Try this

Compare two ways of doing the same thing:

```powershell
(Measure-Command { Get-ChildItem -Path .\docs -Recurse -Filter *.md }).TotalMilliseconds
(Measure-Command { Get-ChildItem -Path .\docs -Recurse | Where-Object Extension -eq '.md' }).TotalMilliseconds
```

`-Filter` is usually much faster because the file system does the filtering.
