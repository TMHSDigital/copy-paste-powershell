---
title: Find which program is using a port
cmdlet: Get-NetTCPConnection
aliases: []
category: network
difficulty: intermediate
topics: [network, ports, troubleshooting]
command: Get-NetTCPConnection -LocalPort 8080 | Select-Object LocalAddress, LocalPort, State, OwningProcess
summary: List open TCP connections and listening ports, and the process behind each one.
module: NetTCPIP
platforms: [windows]
equivalents:
  bash: sudo lsof -i :8080
  cmd: netstat -ano | findstr :8080
---

"Port 8080 is already in use" usually means another program got there first. This shows which one.

`OwningProcess` is a process ID. Pass it to `Get-Process` to get the name.

## Try this

Name the program on a port:

```powershell
$conn = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) { Get-Process -Id $conn.OwningProcess } else { 'Nothing is using port 8080.' }
```

Everything that is listening for connections:

```powershell
Get-NetTCPConnection -State Listen |
    Sort-Object LocalPort |
    Select-Object LocalPort, @{ Name = 'Process'; Expression = { (Get-Process -Id $_.OwningProcess).ProcessName } }
```
