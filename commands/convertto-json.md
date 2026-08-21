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
---

Makes JSON. `-Depth 5` (or higher) is often required. The default depth in Windows PowerShell 5.1 is 2, which silently truncates nested objects.

## Try this

```powershell
Get-Date | ConvertTo-Json
```
