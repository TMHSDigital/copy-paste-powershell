---
title: Run a script
summary: Unblock downloaded files, call a .ps1 with parameters, and stay in the right folder.
order: 4
topics: [scripts]
---

A script is a `.ps1` file. PowerShell will not run it just because you double-clicked it in Explorer (that often opens Notepad). Run it from a prompt.

## Get into the folder

```powershell
Set-Location -Path .\scripts\folder-inventory
Get-ChildItem
```

## Run it

```powershell
.\folder-inventory.ps1 -Path .\docs -OutputPath .\files.csv
```

The `.\` matters. PowerShell does not run scripts from the current directory unless you say so. That is intentional.

## Parameters

Anything after the file name is parameters. Use the names from `Get-Help`:

```powershell
Get-Help .\folder-inventory.ps1 -Full
```

Scripts in this repo use `-WhatIf` where they change files. Pass it the first time.

## Downloaded from the internet

Windows may mark the file as downloaded. Then PowerShell blocks it even under RemoteSigned:

```powershell
Unblock-File -Path .\folder-inventory.ps1
```

Only unblock files you trust.

## Running from somewhere else

```powershell
& '.\scripts\folder-inventory\folder-inventory.ps1' -Path .\docs -OutputPath .\files.csv
```

`&` is the call operator. Use it when the path is in quotes.
