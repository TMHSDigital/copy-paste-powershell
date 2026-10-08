---
title: List local user accounts
cmdlet: Get-LocalUser
aliases: []
category: system
difficulty: beginner
topics: [system, users, security]
command: Get-LocalUser | Select-Object Name, Enabled, LastLogon
summary: See the accounts that exist on this computer, which are enabled, and when they last signed in.
module: Microsoft.PowerShell.LocalAccounts
platforms: [windows]
equivalents:
  cmd: net user
notes:
  "7": Works natively on Windows 10 version 1809 and later. Not available in 32-bit PowerShell on 64-bit Windows; use the normal 64-bit PowerShell window.
---

Lists accounts stored on this computer only. Domain and Microsoft-account sign-ins appear here only if they also have a local account.

Reading the list does not need an administrator prompt. Creating or changing accounts does.

## Try this

Who is in the local Administrators group?

```powershell
Get-LocalGroupMember -Group Administrators
```

Enabled accounts that have not signed in for 90 days:

```powershell
Get-LocalUser |
    Where-Object { $_.Enabled -and $_.LastLogon -lt (Get-Date).AddDays(-90) } |
    Select-Object Name, LastLogon
```
