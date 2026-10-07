---
title: Install a module from the PowerShell Gallery
cmdlet: Install-Module
aliases: []
category: help
difficulty: intermediate
topics: [modules, install]
command: Install-Module -Name ImportExcel -Scope CurrentUser
summary: Download and install extra commands, for your user only, no admin needed.
module: PowerShellGet
platforms: [windows, linux, macos]
warning: Modules are code that runs as you. Install only ones you trust, and check the publisher and download count on the Gallery page first.
---

Modules add commands. The [PowerShell Gallery](https://www.powershellgallery.com/) is the official public catalog.

`-Scope CurrentUser` installs for you only and does not need an administrator prompt.

The first time, PowerShell may ask to install the NuGet provider and warn that the repository is "untrusted." Both are normal; answer **Y** if you trust the module.

## Try this

```powershell
Find-Module -Name ImportExcel
Install-Module -Name ImportExcel -Scope CurrentUser
Get-Command -Module ImportExcel
```

Update later with `Update-Module -Name ImportExcel`. Remove it with `Uninstall-Module -Name ImportExcel`.

PowerShell 7.4+ also ships the newer `Install-PSResource`, which works the same way.
