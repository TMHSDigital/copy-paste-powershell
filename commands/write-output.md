---
title: Print a message (Write-Output vs Write-Host)
cmdlet: Write-Output
aliases: [echo, write]
category: text
difficulty: beginner
topics: [text, output, scripts]
command: Write-Output 'Backup finished'
summary: Send a value down the pipeline. Write-Host only paints the screen.
module: Microsoft.PowerShell.Utility
platforms: [windows, linux, macos]
equivalents:
  bash: echo 'Backup finished'
  cmd: echo Backup finished
---

Both commands show text, but they are not the same:

| | `Write-Output` | `Write-Host` |
| --- | --- | --- |
| Goes down the pipeline | Yes | No |
| Can be saved with `>` or `Out-File` | Yes | No |
| Colors | No | `-ForegroundColor` |
| Use it for | Results | Messages for the person watching |

In a script, a bare value on its own line is the same as `Write-Output`. So `'Done'` prints "Done."

For progress or warnings, there are also `Write-Verbose`, `Write-Warning`, and `Write-Progress`, which people can turn off or redirect.

## Try this

```powershell
Write-Host 'Checking disks...' -ForegroundColor Cyan
Write-Output 'C: ok' | Out-File -FilePath .\report.txt
Get-Content -Path .\report.txt
```

Only "C: ok" ends up in the file.
