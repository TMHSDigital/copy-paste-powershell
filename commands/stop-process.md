---
title: Stop a process
cmdlet: Stop-Process
aliases: [spps, kill]
category: system
difficulty: beginner
topics: [process]
command: Stop-Process -Name notepad -WhatIf
featured: false
warning: Killing the wrong process can lose work. Filter carefully. Use -WhatIf.
summary: Terminate a process by name or Id.
module: Microsoft.PowerShell.Management
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: kill 1234
  cmd: taskkill /PID 1234
  powershell: Stop-Process -Id 1234 -WhatIf
notes:
  "7": On Linux and macOS, kill runs the system command instead of this cmdlet. Type the full cmdlet name there.
---

Stops processes. Prefer `-Id` when more than one process shares a name. `-Force` skips confirmation in some hosts.

## Try this

```powershell
Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf
```
