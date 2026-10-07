#Requires -Modules @{ ModuleName = 'Pester'; ModuleVersion = '5.0' }

BeforeAll {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    & node (Join-Path $repoRoot 'tools/build-module.mjs') | Out-Null
    $manifest = Join-Path $repoRoot 'module/CopyPastePowerShell/CopyPastePowerShell.psd1'
    Import-Module $manifest -Force
}

AfterAll {
    Remove-Module CopyPastePowerShell -ErrorAction SilentlyContinue
}

Describe 'CopyPastePowerShell module' {
    It 'has a valid manifest' {
        $info = Test-ModuleManifest -Path (Join-Path (Split-Path -Parent $PSScriptRoot) 'module/CopyPastePowerShell/CopyPastePowerShell.psd1')
        $info.Name | Should -Be 'CopyPastePowerShell'
    }

    It 'exports exactly the functions listed in the manifest' {
        $exported = (Get-Command -Module CopyPastePowerShell).Name | Sort-Object
        $listed = (Import-PowerShellDataFile (Join-Path (Split-Path -Parent $PSScriptRoot) 'module/CopyPastePowerShell/CopyPastePowerShell.psd1')).FunctionsToExport | Sort-Object
        ($exported -join ',') | Should -Be ($listed -join ',')
    }

    It 'keeps comment-based help and -WhatIf on wrapped scripts' {
        (Get-Help Backup-Folder).Synopsis | Should -Match 'timestamped'
        (Get-Command Backup-Folder).Parameters.Keys | Should -Contain 'WhatIf'
    }

    It 'runs a wrapped script' {
        $dir = Join-Path $TestDrive 'mod'
        New-Item -ItemType Directory -Path "$dir\docs" -Force | Out-Null
        $dest = Backup-Folder -Source "$dir\docs" -DestinationRoot "$dir\backups"
        $dest | Should -Exist
    }

    It 'Find-Snippet ranks an exact alias match first' {
        (Find-Snippet ls | Select-Object -First 1).Cmdlet | Should -Be 'Get-ChildItem'
    }

    It 'Find-Snippet matches bash equivalents' {
        (Find-Snippet grep | Select-Object -First 1).Cmdlet | Should -Be 'Select-String'
    }

    It 'Find-Snippet warns instead of returning junk when nothing matches' {
        $result = Find-Snippet 'zzzz-no-such-thing' 3>$null
        $result | Should -BeNullOrEmpty
    }
}
