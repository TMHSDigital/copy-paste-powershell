# The site's scripts, as module functions. The scripts in scripts/ stay the
# single source of truth: each one becomes a function with the same help,
# parameters, and -WhatIf support.

$scriptMap = [ordered]@{
    'Backup-Folder'           = 'backup-folder'
    'Export-InstalledProgram' = 'export-installed-programs'
    'Find-LargeFile'          = 'find-large-files'
    'Export-FolderInventory'  = 'folder-inventory'
    'Remove-OldFile'          = 'remove-old-files'
    'Rename-FileBatch'        = 'rename-files'
    'Start-LoggedTranscript'  = 'start-logged-transcript'
    'Test-HostList'           = 'test-hosts'
}

function Resolve-CppScriptPath {
    param([string]$Name)
    # Packaged module: Scripts\<name>.ps1. Repo checkout: ..\..\scripts\<name>\<name>.ps1
    $candidates = @(
        (Join-Path -Path $PSScriptRoot -ChildPath "Scripts\$Name.ps1"),
        (Join-Path -Path $PSScriptRoot -ChildPath "..\..\scripts\$Name\$Name.ps1")
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            return (Resolve-Path -LiteralPath $candidate).ProviderPath
        }
    }
    throw "CopyPastePowerShell: cannot find $Name.ps1. The module install looks incomplete."
}

foreach ($entry in $scriptMap.GetEnumerator()) {
    $path = Resolve-CppScriptPath -Name $entry.Value
    $body = [System.IO.File]::ReadAllText($path)
    Set-Item -Path "Function:\script:$($entry.Key)" -Value ([scriptblock]::Create($body))
}

function Find-Snippet {
    <#
    .SYNOPSIS
        Search the Copy-Paste PowerShell command catalog from the prompt.

    .DESCRIPTION
        Returns matching commands with their one-liner and a link to the
        page that explains them. Every word you type must match.

    .PARAMETER Query
        Words to look for, for example: zip, "list files", grep.

    .PARAMETER Copy
        Put the first match's one-liner on the clipboard.

    .EXAMPLE
        Find-Snippet zip

    .EXAMPLE
        Find-Snippet grep -Copy
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position = 0, ValueFromRemainingArguments)]
        [string[]]$Query,

        [switch]$Copy
    )

    $dataPath = Join-Path -Path $PSScriptRoot -ChildPath 'snippets.json'
    if (-not (Test-Path -LiteralPath $dataPath)) {
        throw 'snippets.json is missing. In a repo checkout, run: node tools/build-module.mjs'
    }
    $data = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    $words = @(($Query -join ' ').ToLowerInvariant() -split '\s+' | Where-Object { $_ })

    $results = foreach ($item in $data.commands) {
        $haystack = @($item.cmdlet, $item.title, $item.summary) + @($item.aliases) + @($item.topics) + @($item.equivalents) -join ' '
        $haystack = $haystack.ToLowerInvariant()
        $allMatch = $true
        foreach ($word in $words) {
            if (-not $haystack.Contains($word)) {
                $allMatch = $false
                break
            }
        }
        if (-not $allMatch) {
            continue
        }
        $score = 0
        $q = ($words -join ' ')
        if ($item.cmdlet.ToLowerInvariant() -eq $q) { $score += 100 }
        if (@($item.aliases) -contains $q) { $score += 90 }
        if (@($item.equivalents | ForEach-Object { ($_ -split '\s+')[0] }) -contains $q) { $score += 80 }
        if ($item.title.ToLowerInvariant().Contains($q)) { $score += 30 }
        [pscustomobject]@{
            PSTypeName = 'CopyPastePowerShell.Snippet'
            Cmdlet     = $item.cmdlet
            Title      = $item.title
            Command    = $item.command
            Url        = $data.siteUrl + $item.url
            Score      = $score
        }
    }

    $sorted = @($results | Sort-Object -Property @{ Expression = 'Score'; Descending = $true }, Cmdlet)
    if ($sorted.Count -eq 0) {
        Write-Warning "No matches. Request it: $($data.repo)/issues/new?template=request-command.yml"
        return
    }
    if ($Copy) {
        Set-Clipboard -Value $sorted[0].Command
        Write-Verbose "Copied: $($sorted[0].Command)"
    }
    $sorted | Select-Object Cmdlet, Title, Command, Url
}

Export-ModuleMember -Function (@($scriptMap.Keys) + 'Find-Snippet')
