---
title: Logged transcript
summary: Start a transcript in a folder you choose, under a timestamped file name.
difficulty: beginner
topics: [logging]
parameters:
  - name: LogDirectory
    type: string
    required: false
    description: Folder for the log. Default is the TEMP folder.
  - name: Stop
    type: switch
    required: false
    description: Stop the current transcript instead of starting one.
---

Wraps `Start-Transcript` so you do not dump a log into the current directory by accident. Stop with `-Stop` or `Stop-Transcript`.

```powershell
.\start-logged-transcript.ps1
.\start-logged-transcript.ps1 -LogDirectory .\logs
.\start-logged-transcript.ps1 -Stop
```
