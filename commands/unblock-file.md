---
title: Allow a downloaded script to run
cmdlet: Unblock-File
aliases: []
category: help
difficulty: beginner
topics: [scripts, security, download]
command: Unblock-File -Path .\script.ps1
summary: Remove the "downloaded from the internet" mark so a script you trust can run.
module: Microsoft.PowerShell.Utility
platforms: [windows]
---

When you download a file, Windows tags it as coming from the internet. Under the usual `RemoteSigned` execution policy, PowerShell refuses to run a tagged `.ps1` and says it "is not digitally signed."

`Unblock-File` removes that tag. It does not change your execution policy, and it only affects the files you name.

**Read the script before you unblock it.** The tag is there to make you stop and look.

## Common parameters

- `-Path` takes wildcards, so `.\*.ps1` unblocks every script in the folder.
- `-WhatIf` shows which files it would unblock.

## Try this

```powershell
Get-ChildItem -Path .\downloads -Filter *.ps1 | Unblock-File -WhatIf
```

You can also right-click the file in Explorer, choose **Properties**, and tick **Unblock**.
