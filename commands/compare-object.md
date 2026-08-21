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
---

Compares two collections. `<=` means only in the reference (old). `=>` means only in the difference (new). `==` appears if you pass `-IncludeEqual`.

## Try this

```powershell
$old = Get-Content -Path .\old.txt
$new = Get-Content -Path .\new.txt
Compare-Object -ReferenceObject $old -DifferenceObject $new
```
