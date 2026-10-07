---
title: Compare two lists
cmdlet: Compare-Object
aliases: [compare, diff]
category: text
difficulty: intermediate
topics: [pipeline, compare]
command: Compare-Object -ReferenceObject $old -DifferenceObject $new
featured: false
summary: Show what was added or removed between two sets.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: diff a.txt b.txt
  cmd: fc a.txt b.txt
  powershell: Compare-Object (Get-Content -Path .\a.txt) (Get-Content -Path .\b.txt)
notes:
  "7": On Linux and macOS, diff runs the system command instead of this cmdlet. Type the full cmdlet name there.
---

Compares two collections. `<=` means only in the reference (old). `=>` means only in the difference (new). `==` appears if you pass `-IncludeEqual`.

## Try this

```powershell
$old = Get-Content -Path .\old.txt
$new = Get-Content -Path .\new.txt
Compare-Object -ReferenceObject $old -DifferenceObject $new
```
