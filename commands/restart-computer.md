---
title: Restart the computer
cmdlet: Restart-Computer
aliases: []
category: system
difficulty: beginner
topics: [system, restart]
command: Restart-Computer -WhatIf
summary: Restart now, from the prompt or a script.
module: Microsoft.PowerShell.Management
platforms: [windows]
warning: Restarts immediately with no countdown. Save your work first.
equivalents:
  bash: sudo reboot
  cmd: shutdown /r /t 0
---

Restarts the computer straight away. `-WhatIf` shows what would happen without restarting.

`-Force` restarts even if programs have unsaved work. Avoid it on your own machine.

To shut down instead, use `Stop-Computer`.

## Try this

Restart in 5 minutes, with a warning to anyone signed in:

```powershell
shutdown.exe /r /t 300 /c "Restarting for updates in 5 minutes"
```

Changed your mind? `shutdown.exe /a` cancels it.
