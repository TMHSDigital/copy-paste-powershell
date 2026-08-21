---
title: Execution policy
summary: Why a script is blocked, what each policy means, and what to change (if anything).
order: 3
topics: [security]
---

Execution policy is not antivirus. It is a seatbelt that stops you from running unsigned scripts by accident. Group Policy can lock it. A determined user can bypass it. Treat it as a hint, not a security boundary.

## See the current policy

```powershell
Get-ExecutionPolicy -List
```

The effective policy is the first one in this order that is not `Undefined`:

1. MachinePolicy (Group Policy)
2. UserPolicy (Group Policy)
3. Process (this window only)
4. CurrentUser
5. LocalMachine

## Common values

| Policy | Meaning |
| --- | --- |
| Restricted | No scripts. Interactive commands still work. |
| RemoteSigned | Local scripts run. Downloaded scripts need a signature. |
| AllSigned | Every script needs a trusted signature. |
| Bypass | Do not block. Use for one process, not as a lifestyle. |
| Unrestricted | Runs everything, warns on downloaded files. |

On many Windows 10/11 machines, CurrentUser is already `RemoteSigned`. That is a reasonable default.

## Change it (CurrentUser only)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

If MachinePolicy or UserPolicy is set, this will not win. Talk to whoever manages the machine.

## One-shot bypass

To run a single script you trust, without changing policy:

```powershell
powershell -ExecutionPolicy Bypass -File .\folder-inventory.ps1 -Path .\docs -OutputPath .\files.csv
```

Still read the script first. Bypass is not a substitute for that.
