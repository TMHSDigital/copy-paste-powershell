@{
    RootModule           = 'CopyPastePowerShell.psm1'
    ModuleVersion        = '0.1.0'
    GUID                 = '2cda21e6-19d5-418e-b790-2a44f51550cd'
    Author               = 'TMHSDigital'
    CompanyName          = 'TMHSDigital'
    Copyright            = 'Copyright 2026 TMHSDigital. Apache License 2.0.'
    Description          = 'Beginner-friendly, preview-first scripts from Copy-Paste PowerShell (backup, cleanup, bulk rename, inventories, host checks), plus Find-Snippet to search the command catalog from the prompt.'
    PowerShellVersion    = '5.1'
    CompatiblePSEditions = @('Desktop', 'Core')
    FunctionsToExport    = @(
        'Backup-Folder',
        'Export-InstalledProgram',
        'Find-LargeFile',
        'Export-FolderInventory',
        'Remove-OldFile',
        'Rename-FileBatch',
        'Start-LoggedTranscript',
        'Test-HostList',
        'Find-Snippet'
    )
    CmdletsToExport      = @()
    VariablesToExport    = @()
    AliasesToExport      = @()
    PrivateData          = @{
        PSData = @{
            Tags         = @('beginner', 'cheatsheet', 'backup', 'cleanup', 'rename', 'inventory', 'Windows', 'Linux', 'MacOS')
            LicenseUri   = 'https://github.com/TMHSDigital/Powershell-for-Dummies/blob/main/LICENSE'
            ProjectUri   = 'https://tmhsdigital.github.io/Powershell-for-Dummies/'
            ReleaseNotes = 'https://github.com/TMHSDigital/Powershell-for-Dummies/releases'
        }
    }
}
