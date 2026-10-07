---
title: Turn results into an HTML report
cmdlet: ConvertTo-Html
aliases: []
category: text
difficulty: beginner
topics: [text, report, html]
command: Get-Service | ConvertTo-Html -Property Name, Status -Title 'Services' | Out-File -FilePath .\services.html
summary: Make a simple web page table from any command's output, to email or open in a browser.
module: Microsoft.PowerShell.Utility
platforms: [windows, linux, macos]
---

Converts objects into an HTML table. Pipe the result to `Out-File` and open it in any browser. Pick columns with `-Property`, or the report will include every property.

## Try this

A small disk report with a heading and a timestamp:

```powershell
Get-PSDrive -PSProvider FileSystem |
    Select-Object Name,
        @{ Name = 'FreeGB'; Expression = { [math]::Round($_.Free / 1GB, 1) } },
        @{ Name = 'UsedGB'; Expression = { [math]::Round($_.Used / 1GB, 1) } } |
    ConvertTo-Html -Title 'Disk report' -PreContent '<h1>Disk report</h1>' -PostContent "<p>Created $(Get-Date)</p>" |
    Out-File -FilePath .\disk-report.html

Start-Process -FilePath .\disk-report.html
```

Add a style sheet with `-CssUri` to make it look nicer.
