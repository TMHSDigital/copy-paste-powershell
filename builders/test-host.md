---
title: Test a host
summary: Ping or check a TCP port.
topics: [network, ping]
fields:
  - name: host
    label: Host name or IP
    type: text
    required: true
    default: "example.com"
    placeholder: "example.com"
  - name: tcp
    label: Test a TCP port instead of ping
    type: checkbox
    default: false
    explain: "Test-NetConnection -Port opens a TCP connection. This works even when ping is blocked."
    explainOff: "Test-Connection sends ping (ICMP) requests. Many hosts block ping and still work."
  - name: port
    label: Port (used when TCP is checked)
    type: number
    requiredWhen: { tcp: true }
    min: 1
    max: 65535
    default: "443"
template: |
  {{#tcp}}Test-NetConnection -ComputerName {{host:q}} -Port {{port}}{{/tcp}}{{^tcp}}Test-Connection -ComputerName {{host:q}} -Count 2{{/tcp}}
---

Ping uses ICMP. A host can be up and still drop ping. TCP mode uses `Test-NetConnection`, which only exists on Windows. On Linux or macOS, use the [test hosts script](/scripts/test-hosts/) with `-Port`.
