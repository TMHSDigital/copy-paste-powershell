@{
    Severity     = @('Error', 'Warning')
    ExcludeRules = @(
        # Scripts are meant to print friendly output in the console.
        'PSAvoidUsingWriteHost'
    )
    Rules        = @{
        PSUseCompatibleSyntax = @{
            Enable         = $true
            # Everything here must run on Windows PowerShell 5.1 and PowerShell 7.
            TargetVersions = @('5.1', '7.0')
        }
    }
}
