---
title: Pipelines
summary: Left to right, objects not text, and why Format-Table has to be last.
order: 5
topics: [pipeline]
---

A pipeline is `command | command | command`. The object coming out of the left side becomes input on the right.

```powershell
Get-ChildItem -Path .\docs -File |
    Where-Object { $_.Length -gt 10KB } |
    Sort-Object Length -Descending |
    Select-Object Name, Length
```

Read it as: get files, keep the large ones, sort, then keep two properties.

## `$_` is the current object

Inside `Where-Object` and `ForEach-Object`, `$_` (or `$PSItem`) is "this one". `.Length` is a property, not the string length of the file name.

## Discovery

When you do not know the property name:

```powershell
Get-ChildItem | Get-Member
```

## Format cmdlets are a dead end

`Format-Table` and `Format-List` turn objects into display records. Do not pipe those into `Export-Csv`. Filter and `Select-Object` first, format last, or skip formatting and export instead.

## Left-to-right, not nested soup

If a line is getting unreadable, break it with backticks at the pipe, or stop and write a small script. The [builders](/builders/) exist for the boilerplate in between.
