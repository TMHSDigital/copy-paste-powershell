---
title: Run a script on a schedule
summary: Generate a Register-ScheduledTask command that runs a .ps1 daily, weekly, or at sign-in.
topics: [automation, schedule, windows]
fields:
  - name: taskName
    label: Task name
    type: text
    required: true
    default: "Nightly folder backup"
    help: Shows up in Task Scheduler. Pick something you will recognize later.
  - name: script
    label: Full path to the .ps1
    type: text
    required: true
    default: "C:\\Scripts\\backup-folder.ps1"
    placeholder: "C:\\Scripts\\backup-folder.ps1"
    help: Use a full path. Scheduled tasks do not start in your current folder.
  - name: arguments
    label: Script parameters (optional)
    type: text
    default: ""
    placeholder: "-Source D:\\Docs -DestinationRoot E:\\Backups"
    help: Typed exactly as you would after the script name.
  - name: frequency
    label: When
    type: select
    default: daily
    options:
      - { value: daily, label: Every day, explain: "-Daily -At runs it once a day at that time." }
      - { value: weekly, label: Once a week, explain: "-Weekly -DaysOfWeek runs it on the chosen day at that time." }
      - { value: logon, label: When I sign in, explain: "-AtLogOn runs it each time you sign in to Windows." }
  - name: day
    label: Day (weekly only)
    type: select
    default: Monday
    options:
      - { value: Monday, label: Monday }
      - { value: Tuesday, label: Tuesday }
      - { value: Wednesday, label: Wednesday }
      - { value: Thursday, label: Thursday }
      - { value: Friday, label: Friday }
      - { value: Saturday, label: Saturday }
      - { value: Sunday, label: Sunday }
  - name: time
    label: Time (daily and weekly)
    type: time
    requiredWhen: { frequency: [daily, weekly] }
    default: "09:00"
template: |
  # Windows only. If you get "Access is denied", open PowerShell as administrator.
  $script = {{script:q}}
  # A script downloaded from the internet is blocked, and the task would fail
  # without telling you. Unblock it once (only do this for scripts you trust).
  Unblock-File -LiteralPath $script
  $arguments = '-NoProfile -WindowStyle Hidden -ExecutionPolicy RemoteSigned -File "{0}" {1}' -f $script, {{arguments:q}}
  $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments
  {{#frequency_daily}}$trigger = New-ScheduledTaskTrigger -Daily -At '{{time}}'{{/frequency_daily}}{{#frequency_weekly}}$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek {{day}} -At '{{time}}'{{/frequency_weekly}}{{#frequency_logon}}$trigger = New-ScheduledTaskTrigger -AtLogOn{{/frequency_logon}}
  # If the PC was off or asleep at that time, run it as soon as it can.
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
  Register-ScheduledTask -TaskName {{taskName:q}} -Action $action -Trigger $trigger -Settings $settings

  # Test it now: Start-ScheduledTask -TaskName {{taskName:q}}
  # Check it:    Get-ScheduledTaskInfo -TaskName {{taskName:q}} | Select-Object LastRunTime, LastTaskResult, NextRunTime
  # Undo it:     Unregister-ScheduledTask -TaskName {{taskName:q}}
---

Creates a Windows scheduled task that runs your script with Windows PowerShell, in the background with no window. The task runs as you, **only while you are signed in**. If the PC is off or asleep at the scheduled time, it runs as soon as the PC is back.

## Check that it worked

1. Run the **Test it now** line from the bottom of the script.
2. Run the **Check it** line. `LastTaskResult` should be `0`. Any other number means the script failed or could not start. `267009` means it is still running.
3. If it failed, run the script by hand in a new PowerShell window and read the error.

Test the script by hand first. If it works at the prompt but not on the schedule, the usual cause is a relative path inside the script. Scheduled tasks start in `C:\Windows\System32`, not in your folder.

## Run it even when you are signed out

Open **Task Scheduler**, find the task under **Task Scheduler Library**, open **Properties**, and choose **Run whether user is logged on or not**. Windows asks for your password and stores it for the task. Network drives mapped to your account are not available in that mode, so use full `\\server\share` paths in the script.
