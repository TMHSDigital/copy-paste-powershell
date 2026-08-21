---
title: Write objects to a CSV file
cmdlet: Export-Csv
aliases: [epcsv]
category: text
difficulty: beginner
topics: [csv]
command: "Get-ChildItem -File | Select-Object Name, Length | Export-Csv -Path .\\files.csv -NoTypeInformation"
featured: false
summary: Save objects as a CSV file.
---

Writes a CSV. `-NoTypeInformation` drops the `#TYPE` header (needed in Windows PowerShell 5.1). In PowerShell 7 that is already the default.

Select the properties you want first. Do not export formatted objects.

## Try this

```powershell
Get-Process | Select-Object -First 5 Name, Id | Export-Csv -Path .\procs.csv -NoTypeInformation
```
