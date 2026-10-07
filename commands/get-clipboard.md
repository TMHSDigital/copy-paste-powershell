---
title: Read what is on the clipboard
cmdlet: Get-Clipboard
aliases: [gcb]
category: text
difficulty: beginner
topics: [text, clipboard]
command: Get-Clipboard
summary: Get the clipboard contents as text you can filter, count, or save.
module: Microsoft.PowerShell.Management
platforms: [windows, linux, macos]
equivalents:
  bash: pbpaste
notes:
  "7": Works on Linux (needs xclip) and macOS as well as Windows.
---

Returns the clipboard text, one line per string. Handy for cleaning up a list someone pasted you in chat.

## Try this

Copy a list of names, then remove blanks and duplicates and put it back:

```powershell
Get-Clipboard |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ } |
    Sort-Object -Unique |
    Set-Clipboard
```
