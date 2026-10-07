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

Makes JSON. `-Depth 5` (or higher) is often required. The default depth in Windows PowerShell 5.1 is 2, which silently truncates nested objects.

## Try this

```powershell
Get-Date | ConvertTo-Json
```
