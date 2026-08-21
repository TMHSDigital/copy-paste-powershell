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
---

Stops processes. Prefer `-Id` when more than one process shares a name. `-Force` skips confirmation in some hosts.

## Try this

```powershell
Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf
```
