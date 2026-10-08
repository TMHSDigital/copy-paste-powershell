<#
.SYNOPSIS
    Start or stop a transcript in a chosen folder.

.PARAMETER LogDirectory
    Folder for the log file. Default: your temp folder (works on Windows, macOS, and Linux).

.PARAMETER Stop
    Stop the current transcript.

.EXAMPLE
    .\start-logged-transcript.ps1 -LogDirectory .\logs
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$LogDirectory = [System.IO.Path]::GetTempPath(),

    [switch]$Stop
)

$ErrorActionPreference = 'Stop'

if ($Stop) {
    if ($PSCmdlet.ShouldProcess('session', 'Stop-Transcript')) {
        try {
            Stop-Transcript
        } catch {
            Write-Warning 'No transcript is running in this window, so there is nothing to stop.'
        }
    }
    return
}

if (-not (Test-Path -LiteralPath $LogDirectory -PathType Container)) {
    if ($PSCmdlet.ShouldProcess($LogDirectory, 'Create log folder')) {
        New-Item -ItemType Directory -Path $LogDirectory | Out-Null
    }
}

$log = Join-Path -Path $LogDirectory -ChildPath ("transcript-{0}.txt" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))

if ($PSCmdlet.ShouldProcess($log, 'Start-Transcript')) {
    Start-Transcript -LiteralPath $log
    Write-Output $log
}
