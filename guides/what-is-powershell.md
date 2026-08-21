---
title: What is PowerShell?
summary: A shell and a scripting language that works with objects, not just text.
order: 1
topics: [intro]
---

PowerShell is two things: a prompt you type into, and a language for scripts. It ships on Windows. PowerShell 7 (`pwsh`) also runs on macOS and Linux.

Commands are **cmdlets**. Names are `Verb-Noun`: `Get-ChildItem`, `Stop-Process`. That looks stiff. You get used to it, and you can search by verb or noun with `Get-Command`.

The important difference from Command Prompt: **the pipeline passes objects**, not text. `Get-ChildItem` does not print a blob of characters. It produces file objects with `Name`, `Length`, `LastWriteTime`. The next command can filter on those.

You do not need to memorize the catalog. You need:

1. How to open a prompt ([Open PowerShell](/guides/open-powershell/))
2. `Get-Help` and `Get-Member`
3. The habit of `-WhatIf` before anything that changes files

Then steal one-liners from this site.
