---
title: Search text like grep
cmdlet: Select-String
aliases: [sls]
category: text
difficulty: beginner
topics: [text, search]
command: "Select-String -Path .\\docs\\*.md -Pattern 'TODO'"
featured: false
summary: Find lines that match a pattern in files or pipeline text.
---

This is grep. `-Pattern` can be a regex. `-SimpleMatch` treats it as literal text. `-Path` accepts wildcards. Pipeline input works too.

## Try this

```powershell
Select-String -Path .\docs\*.md -Pattern 'TODO' -SimpleMatch
```
