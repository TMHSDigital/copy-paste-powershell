---
title: See who can access a file or folder
cmdlet: Get-Acl
aliases: []
category: files
difficulty: intermediate
topics: [files, security, permissions]
command: (Get-Acl -Path .\docs).Access | Select-Object IdentityReference, FileSystemRights, AccessControlType
summary: List the users and groups that have permissions on a file or folder, and what they can do.
module: Microsoft.PowerShell.Security
platforms: [windows]
equivalents:
  cmd: icacls docs
  bash: ls -ld docs
---

Every file and folder on Windows has an access control list (ACL): who is allowed to read, change, or fully control it. `Get-Acl` reads that list.

The `.Access` property holds one row per rule:

- `IdentityReference` is the user or group, like `BUILTIN\Users`.
- `FileSystemRights` is what they can do: `ReadAndExecute`, `Modify`, `FullControl`.
- `AccessControlType` is `Allow` or `Deny`. A Deny rule wins over an Allow rule.

`.Owner` tells you who owns the item.

## Try this

```powershell
(Get-Acl -Path .\docs).Owner
(Get-Acl -Path .\docs).Access | Where-Object IdentityReference -like '*Users*'
```

Changing permissions with `Set-Acl` is easy to get wrong and can lock you out. For one-off changes, the **Security** tab in the folder's Properties is safer.
