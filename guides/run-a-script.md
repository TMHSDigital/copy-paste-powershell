---
title: Run a script
summary: Download a .ps1, unblock it, and run it with parameters from the right folder.
order: 4
topics: [scripts]
---

A script is a `.ps1` file. Double-clicking one in Explorer usually opens Notepad instead of running it. Run it from a PowerShell prompt.

## 1. Download it

On any script page, click **Download**. The file lands in your Downloads folder.

## 2. Go to that folder

```powershell
Set-Location -Path "$HOME\Downloads"
Get-ChildItem -Filter *.ps1
```

You should see the file you downloaded.

## 3. Unblock it

Windows marks downloaded files as coming from the internet. Under the `RemoteSigned` policy, PowerShell refuses to run them until you unblock them:

```powershell
Unblock-File -Path .\folder-inventory.ps1
```

Read the script first. Only unblock files you trust.

## 4. Run it

```powershell
.\folder-inventory.ps1 -Path .\docs -OutputPath .\files.csv
```

The `.\` matters. PowerShell does not run scripts from the current folder unless you say so. That is on purpose.

If you see "running scripts is disabled on this system", read the [execution policy guide](/guides/execution-policy/).

## Parameters

Anything after the file name is a parameter. Every script here has built-in help:

```powershell
Get-Help .\folder-inventory.ps1 -Full
```

Scripts that change files support `-WhatIf`. Pass it the first time to see what would happen.

## Running from somewhere else

You do not have to `Set-Location` first. Use the full path, in quotes, with `&` in front:

```powershell
& "$HOME\Downloads\folder-inventory.ps1" -Path .\docs -OutputPath .\files.csv
```

`&` is the call operator. Use it whenever the script path is in quotes.
