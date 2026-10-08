---
title: Run a command on another computer
cmdlet: Invoke-Command
aliases: [icm]
category: system
difficulty: intermediate
topics: [system, remoting, network]
command: Invoke-Command -ComputerName PC01 -ScriptBlock { Get-Service -Name Spooler }
summary: Run commands on one or many remote computers and get the results back as objects.
module: Microsoft.PowerShell.Core
platforms: [windows, linux, macos]
equivalents:
  bash: ssh pc01 'systemctl status cups'
  powershell: Invoke-Command -HostName pc01 -ScriptBlock { systemctl status cups }
notes:
  "5.1": Uses WinRM. The remote computer needs remoting turned on (Enable-PSRemoting, run as administrator there), and you need admin rights on it.
  "7": -ComputerName (WinRM) only works from Windows. From Linux or macOS, use -HostName, which connects over SSH; the other computer needs SSH and PowerShell 7 set up for remoting.
---

Runs the script block on the remote computer and brings the output back. Each result gets a `PSComputerName` property, so you can tell machines apart.

`-ComputerName` takes a list, so one line can check many machines at once.

On a work network, remoting is often already set up by IT. At home, it is usually off.

## Try this

```powershell
Invoke-Command -ComputerName PC01, PC02 -ScriptBlock { Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object LastBootUpTime }
```

Use a different account:

```powershell
$cred = Get-Credential
Invoke-Command -ComputerName PC01 -Credential $cred -ScriptBlock { hostname }
```

Pass a local value into the remote block with `$using:`:

```powershell
$name = 'Spooler'
Invoke-Command -ComputerName PC01 -ScriptBlock { Get-Service -Name $using:name }
```
