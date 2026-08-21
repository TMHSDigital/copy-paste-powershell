---
title: Fetch a web page or file
cmdlet: Invoke-WebRequest
aliases: [iwr, wget, curl]
category: network
difficulty: intermediate
topics: [network, http]
command: "Invoke-WebRequest -Uri 'https://example.com' -UseBasicParsing"
featured: false
summary: HTTP GET (and more). .Content is the body.
---

Downloads a response. `.Content` is the body. `.StatusCode` is the status. On Windows PowerShell 5.1, add `-UseBasicParsing` to avoid old Internet Explorer parsing.

For JSON APIs, `Invoke-RestMethod` is usually nicer.

## Try this

```powershell
(Invoke-WebRequest -Uri 'https://example.com' -UseBasicParsing).StatusCode
```
