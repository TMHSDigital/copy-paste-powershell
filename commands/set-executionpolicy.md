---
title: Allow scripts to run on this computer
cmdlet: Set-ExecutionPolicy
aliases: []
category: help
difficulty: intermediate
topics: [scripts, security]
command: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
summary: Change which scripts PowerShell will run. RemoteSigned for your user is the usual answer.
module: Microsoft.PowerShell.Security
platforms: [windows]
warning: Never set Unrestricted or Bypass for the whole machine because a web page told you to. Read the execution policy guide first.
---

If you see "running scripts is disabled on this system," your policy is probably `Restricted`, the default on Windows client editions.

`RemoteSigned` for `CurrentUser` is the common fix. Scripts you write yourself run. Scripts downloaded from the internet must be signed, or you [unblock](/commands/unblock-file/) them one at a time after reading them.

`-Scope CurrentUser` only affects you and does not need an administrator prompt.

If your organization sets the policy with Group Policy, this command cannot override it. `Get-ExecutionPolicy -List` shows who set what.

## Try this

```powershell
Get-ExecutionPolicy -List
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -WhatIf
```

On Linux and macOS, execution policy does not apply. Every script can run.

Read the [execution policy guide](/guides/execution-policy/) for what each policy means.
