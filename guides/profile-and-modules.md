---
title: Your profile and modules
summary: Make shortcuts that load every time, and add commands others have written.
order: 10
topics: [profile, modules, setup]
---

## Your profile

Your profile is a script that runs every time you open PowerShell. It is where personal aliases, functions, and settings go.

See where it lives, and whether it exists yet:

```powershell
$PROFILE
Test-Path -Path $PROFILE
```

Create it and open it in Notepad:

```powershell
if (-not (Test-Path -Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE
```

Things people put in a profile:

```powershell
# Jump to a folder you use all the time
function work { Set-Location -Path "$HOME\Documents\Work" }

# A shorter name for a command you type often
Set-Alias -Name np -Value notepad

# Start in your home folder
Set-Location -Path $HOME
```

Save, then open a new window. Running scripts must be allowed for the profile to load; see [Execution policy](/guides/execution-policy/).

Windows PowerShell 5.1 and PowerShell 7 have **separate** profiles. Run `$PROFILE` in each to see both paths.

## Modules

A module is a package of extra commands. Many come with Windows. More are on the [PowerShell Gallery](https://www.powershellgallery.com/).

```powershell
Get-Module -ListAvailable
Get-Command -Module Microsoft.PowerShell.Archive
```

Install one for your user, with no administrator prompt:

```powershell
Find-Module -Name ImportExcel
Install-Module -Name ImportExcel -Scope CurrentUser
```

Modules load automatically the first time you use one of their commands. A module is code that runs as you, so install only ones you trust. See [Install-Module](/commands/install-module/).
