---
title: Safety
summary: WhatIf, Confirm, and why you should not paste blindly from the internet (including this site).
order: 6
topics: [security]
---

PowerShell will delete files, stop services, and overwrite data as fast as you can press Enter. The language is not dangerous. Unread commands are.

## `-WhatIf`

Most changing cmdlets support it. It prints what would happen and does not do it.

```powershell
Remove-Item -Path .\temp\* -WhatIf
```

The scripts in this repo that change files use `[CmdletBinding(SupportsShouldProcess)]` so `-WhatIf` works. Use it.

## `-Confirm`

Asks before each change. Useful when a wildcard matches more than you expected.

```powershell
Remove-Item -Path .\temp\*.log -Confirm
```

## Do not paste blindly

Read the command. If it contains `Invoke-WebRequest`, `Invoke-Expression`, `irm`, `iex`, encoded strings, or a path under a real user profile, stop.

This site uses placeholder paths only: `.\docs`, `$env:TEMP`, `C:\Path\To\Folder`. If a command you found elsewhere uses a home directory path, rewrite it.

## Prefer parameters over editing scripts

The scripts here take `-Path` and friends. Pass your folder at run time. Do not hardcode machine-specific locations into a file you might commit.

## Transcripts

`Start-Transcript` records the session. Do not transcript passwords. Put logs in `$env:TEMP` or a folder you chose, not a shared dump.

## Admin

A lot of service and system cmdlets need an elevated prompt. Elevation is not a reason to skip `-WhatIf`.
