---
title: Read help for a command
cmdlet: Get-Help
aliases: [help, man]
category: help
difficulty: beginner
topics: [help]
command: Get-Help Get-ChildItem -Full
featured: true
summary: Built-in docs. Start here when you forget a parameter.
module: Microsoft.PowerShell.Core
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: man ls
  cmd: help dir
  powershell: Get-Help Get-ChildItem -Examples
output: |-
  NAME
      Get-ChildItem

  SYNOPSIS
      Gets the items and child items in one or more specified locations.

  SYNTAX
      Get-ChildItem [[-Path] <string[]>] [[-Filter] <string>] [-Include <string[]>]
      [-Exclude <string[]>] [-Recurse] [-Depth <uint>] [-Force] [-Name] ...

  (If you only see a short summary, run Update-Help once as administrator.)
---

The manual. `-Examples` is the useful switch. `-Full` is everything. `-Online` opens the Microsoft page.

Run `Update-Help` once in an elevated session so local help is not a stub.

## Try this

```powershell
Get-Help Get-ChildItem -Examples
```
