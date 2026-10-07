---
title: Show objects as a list
cmdlet: Format-List
aliases: [fl]
category: text
difficulty: beginner
topics: [format]
command: "Get-Item -Path .\\notes.txt | Format-List *"
featured: false
warning: "Same rule as Format-Table: display only, end of the pipeline."
summary: "Pretty-print each object as name: value lines."
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
---

Use this when a table wraps or hides properties. `Format-List *` dumps everything.

## Try this

```powershell
Get-Date | Format-List *
```
