---
title: Group objects by a property
cmdlet: Group-Object
aliases: [group]
category: text
difficulty: intermediate
topics: [pipeline, group]
command: "Get-ChildItem -File | Group-Object -Property Extension"
featured: false
summary: Count and bucket objects that share a property value.
---

Buckets objects. Each group has `Name`, `Count`, and `Group` (the members). Great for "how many of each extension".

## Try this

```powershell
Get-ChildItem -File | Group-Object Extension | Sort-Object Count -Descending
```
