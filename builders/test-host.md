---
title: Test a host
summary: Ping or check a TCP port.
fields:
  - name: host
    label: Host name or IP
    type: text
    default: "example.com"
    placeholder: "example.com"
  - name: tcp
    label: Test a TCP port instead of ping
    type: checkbox
    default: false
  - name: port
    label: Port (used when TCP is checked)
    type: text
    default: "443"
template: |
  {{#tcp}}Test-NetConnection -ComputerName "{{host}}" -Port {{port}}{{/tcp}}{{^tcp}}Test-Connection -ComputerName "{{host}}" -Count 2{{/tcp}}
---

Ping uses ICMP. A host can be up and still drop ping. TCP mode uses `Test-NetConnection` (Windows).
