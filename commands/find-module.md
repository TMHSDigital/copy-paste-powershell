---
title: Search the PowerShell Gallery
cmdlet: Find-Module
aliases: []
category: help
difficulty: beginner
topics: [modules, search]
command: Find-Module -Tag Excel | Select-Object -First 10 Name, Version, Description
summary: Look for modules by name or tag before installing anything.
module: PowerShellGet
platforms: [windows, linux, macos]
---

Searches the PowerShell Gallery without installing anything. Use it to check a module's name, version, and author.

## Try this

```powershell
Find-Module -Name *Excel* | Select-Object Name, Version, Author
Find-Module -Name ImportExcel | Format-List Name, Version, Author, ProjectUri, Description
```

Found one you want? See [Install-Module](/commands/install-module/).
