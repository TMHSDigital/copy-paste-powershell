---
title: Parse JSON text
cmdlet: ConvertFrom-Json
aliases: []
category: text
difficulty: beginner
topics: [json]
command: "Get-Content -Path .\\data.json -Raw | ConvertFrom-Json"
featured: false
summary: Turn a JSON string into objects.
---

The reverse of `ConvertTo-Json`. Use `-Raw` with `Get-Content` so the file is one string, not an array of lines.

## Try this

```powershell
'{ "Name": "Ada" }' | ConvertFrom-Json
```
