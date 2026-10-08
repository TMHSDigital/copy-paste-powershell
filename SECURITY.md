# Security policy

## Reporting a problem

Please **do not** open a public issue for security problems.

Report privately through GitHub: **Security > Report a vulnerability** on this repository, or go straight to [the private advisory form](https://github.com/TMHSDigital/copy-paste-powershell/security/advisories/new).

Things we especially want to hear about:

- A script, command, or builder output on the site that could cause harm beyond what its page says (for example, deleting more than intended).
- A way to make a builder generate a different command than the form shows, including through a shared link.
- Anything that lets a page run code or load content from somewhere other than this site.

We aim to reply within 7 days and to fix confirmed problems in the published site as soon as possible.

## Scope

This project is a static website plus PowerShell scripts that you run on your own machine. Scripts are provided under the Apache License 2.0, without warranty. Read any script before you run it, and use `-WhatIf` first.
