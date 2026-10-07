---
title: Comparison operators
summary: -eq, -like, -match, and why > writes a file instead of comparing.
order: 9
topics: [operators, filter, basics]
---

PowerShell compares with words, not symbols.

| Operator | Means | Example |
| --- | --- | --- |
| `-eq` | equals | `$x -eq 5` |
| `-ne` | not equal | `$status -ne 'Running'` |
| `-gt` / `-ge` | greater than / or equal | `$_.Length -gt 1MB` |
| `-lt` / `-le` | less than / or equal | `$_.LastWriteTime -lt (Get-Date).AddDays(-30)` |
| `-like` | wildcard match | `$_.Name -like '*.log'` |
| `-match` | regular expression | `$_.Name -match '^\d{4}-'` |
| `-contains` | list has this item | `$servers -contains 'db01'` |
| `-in` | item is in this list | `'db01' -in $servers` |

Put `-not` in front to flip a test: `-not (Test-Path -Path .\docs)`.

## The big gotcha: `>` is not "greater than"

```powershell
5 > 3
```

This does **not** print True. It writes `5` into a new file named `3` in the current folder. `>` is redirection, like in other shells. Use `-gt`.

## Case

Comparisons ignore case by default: `'ABC' -eq 'abc'` is `True`. Put a `c` in front for case-sensitive: `-ceq`, `-clike`, `-cmatch`.

## Combine tests

```powershell
Get-ChildItem -File | Where-Object { $_.Extension -eq '.log' -and $_.Length -gt 10MB }
```

`-and`, `-or`, and `-not` combine conditions. Parentheses make the intent clear.

## Size and date shortcuts

`1KB`, `1MB`, `1GB` are real numbers in PowerShell. `(Get-Date).AddDays(-7)` is one week ago. Together they make filters readable:

```powershell
Get-ChildItem -Path .\logs -File |
    Where-Object { $_.Length -gt 50MB -or $_.LastWriteTime -lt (Get-Date).AddDays(-90) }
```
