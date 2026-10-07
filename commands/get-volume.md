---
title: Check free disk space
cmdlet: Get-Volume
aliases: []
category: system
difficulty: beginner
topics: [system, disk]
command: Get-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining, Size
summary: See each drive's size and free space.
module: Storage
platforms: [windows]
equivalents:
  bash: df -h
---

Lists your drives with their total size and free space. The numbers are in bytes, so the second example converts them to GB.

On Linux and macOS, use `Get-PSDrive -PSProvider FileSystem` instead.

## Try this

```powershell
Get-Volume |
    Where-Object DriveLetter |
    Select-Object DriveLetter,
        @{ Name = 'FreeGB'; Expression = { [math]::Round($_.SizeRemaining / 1GB, 1) } },
        @{ Name = 'SizeGB'; Expression = { [math]::Round($_.Size / 1GB, 1) } }
```

Running low? The [find large files](/scripts/find-large-files/) script shows what is taking up the space.
