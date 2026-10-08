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
module: Microsoft.PowerShell.Utility
platforms:
  - windows
  - linux
  - macos
equivalents:
  bash: curl -O https://example.com/file.zip
  cmd: curl.exe -O https://example.com/file.zip
  powershell: Invoke-WebRequest -Uri 'https://example.com/file.zip' -OutFile .\file.zip
notes:
  "7": "-UseBasicParsing does nothing and can be left out. The curl and wget aliases are gone, so those names run the real programs."
  "5.1": curl and wget are aliases for this cmdlet, so curl flags like -O fail. Type curl.exe to run the real curl.
---

Downloads a response. `.Content` is the body. `.StatusCode` is the status. On Windows PowerShell 5.1, add `-UseBasicParsing` to avoid old Internet Explorer parsing.

For JSON APIs, `Invoke-RestMethod` is usually nicer.

Downloads crawling along in Windows PowerShell 5.1? The progress bar is the cause. Turn it off for the session first:

```powershell
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri 'https://example.com/file.zip' -OutFile .\file.zip -UseBasicParsing
```

## Try this

```powershell
(Invoke-WebRequest -Uri 'https://example.com' -UseBasicParsing).StatusCode
```
