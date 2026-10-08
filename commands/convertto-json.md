---
title: Turn objects into JSON
cmdlet: ConvertTo-Json
aliases: []
category: text
difficulty: beginner
topics: [json]
command: "Get-ChildItem -File | Select-Object Name, Length | ConvertTo-Json"
featured: false
summary: Serialize objects as JSON text.
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
notes:
  all: Only 2 levels of nesting are kept by default. Add -Depth 10 for deeper data. PowerShell 7.1+ warns when it cuts something off.
---

Makes JSON. For nested data, add `-Depth 5` (or higher). Without it, anything deeper than 2 levels is cut off and shown as type names. Windows PowerShell 5.1 does this silently.

## Try this

```powershell
Get-Date | ConvertTo-Json
```
