---
title: Open PowerShell
summary: Windows Terminal, pwsh, and the old Windows PowerShell 5.1 host.
order: 2
topics: [intro]
---

## Windows 10 and 11

The good default is **Windows Terminal**. Install it from Microsoft if it is missing. In Terminal, the profile named PowerShell is usually PowerShell 7 (`pwsh`). Windows PowerShell (`powershell.exe`) is the 5.1 host that still ships with Windows.

Either one can run the commands on this site. Notes in the catalog call out cmdlets that are Windows-only or 7-only.

## How to launch it

- Start menu: type `pwsh` or `PowerShell`
- File Explorer: Alt+D, type `pwsh`, Enter (opens in that folder)
- VS Code / Cursor: Terminal panel, then pick a PowerShell profile
- Run (Win+R): `pwsh` or `powershell`

## Which one am I in?

```powershell
$PSVersionTable.PSVersion
```

Major 7 is PowerShell 7. Major 5 is Windows PowerShell 5.1.

## Execution policy is not a lock

If a script will not run, read [Execution policy](/guides/execution-policy/). Do not set it to Unrestricted because a blog said so.
