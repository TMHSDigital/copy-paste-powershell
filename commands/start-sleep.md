---
title: Pause for N seconds
cmdlet: Start-Sleep
aliases: [sleep]
category: system
difficulty: beginner
topics: [time]
command: Start-Sleep -Seconds 5
featured: false
summary: Wait before the next command runs.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: sleep 5
  cmd: timeout /t 5
notes:
  "7": On Linux and macOS, sleep runs the system command instead of this cmdlet. Type the full cmdlet name there.
---

Blocks the session. `-Seconds` or `-Milliseconds`. Use it in loops so you do not hammer a host.

## Try this

```powershell
'before'; Start-Sleep -Seconds 2; 'after'
```
