---
title: Variables
summary: Store a value with $name = ..., reuse it, and know when quotes expand it.
order: 8
topics: [variables, strings, basics]
---

A variable is a name that holds a value. It starts with `$`.

```powershell
$folder = '.\docs'
Get-ChildItem -Path $folder
```

Variables can hold anything, including the output of a command:

```powershell
$bigFiles = Get-ChildItem -Path .\docs -File | Where-Object Length -gt 1MB
$bigFiles.Count
$bigFiles | Select-Object Name, Length
```

## Single vs double quotes

Double quotes **expand** variables. Single quotes keep the text exactly as typed.

```powershell
$name = 'Sam'
"Hello $name"     # Hello Sam
'Hello $name'     # Hello $name
```

When you want to show a property inside double quotes, wrap it in `$( )`:

```powershell
$file = Get-Item -Path .\notes.txt
"Size: $($file.Length) bytes"
```

Rule of thumb: use single quotes unless you need a variable inside.

## Special variables

| Variable | What it is |
| --- | --- |
| `$_` or `$PSItem` | The current object inside `Where-Object` and `ForEach-Object` |
| `$HOME` | Your user folder |
| `$env:TEMP` | Environment variables live under `$env:` |
| `$PWD` | The current folder |
| `$true`, `$false`, `$null` | Yes, no, nothing |
| `$?` | Did the last command succeed? |
| `$PSVersionTable` | Which version of PowerShell you are running |

## Lists

```powershell
$servers = 'web01', 'web02', 'db01'
$servers.Count
$servers[0]
foreach ($s in $servers) { "Checking $s" }
```

Variables disappear when you close the window. To keep something, write it to a file or put it in your [profile](/guides/profile-and-modules/).
