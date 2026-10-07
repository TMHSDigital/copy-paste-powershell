---
title: Objects and properties
summary: Why PowerShell output is not just text, and how to see and pick the parts you want.
order: 7
topics: [objects, properties, pipeline]
---

Most shells pass text between commands. PowerShell passes **objects**: things with named parts called **properties**.

A file from `Get-ChildItem` has a `Name`, a `Length` (size in bytes), a `LastWriteTime`, and dozens more. The table on screen only shows a few of them.

## See every property

```powershell
Get-Item -Path .\notes.txt | Format-List *
```

Or list the property names and their types:

```powershell
Get-Item -Path .\notes.txt | Get-Member -MemberType Property
```

## Pick the properties you want

```powershell
Get-ChildItem -File | Select-Object Name, Length, LastWriteTime
```

`Select-Object` keeps the objects; it just trims them. You can still sort, filter, or export afterwards.

## Read one property

Put the command in parentheses, then add a dot and the property name:

```powershell
(Get-Item -Path .\notes.txt).Length
(Get-Date).DayOfWeek
```

## Make your own column

A calculated property is a little hashtable with a `Name` and an `Expression`. `$_` is the current object:

```powershell
Get-ChildItem -File |
    Select-Object Name, @{ Name = 'SizeKB'; Expression = { [math]::Round($_.Length / 1KB, 1) } }
```

## Why it matters

Because the data stays structured, the same pipeline can end in a table, a CSV, JSON, or a filter, with no text parsing:

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU | Export-Csv -Path .\top.csv -NoTypeInformation
```

Formatting commands like `Format-Table` turn objects into display text. Use them **last**, only for the screen. See [Pipelines](/guides/pipelines/).
