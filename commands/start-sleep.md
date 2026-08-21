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
---

Blocks the session. `-Seconds` or `-Milliseconds`. Use it in loops so you do not hammer a host.

## Try this

```powershell
'before'; Start-Sleep -Seconds 2; 'after'
```
