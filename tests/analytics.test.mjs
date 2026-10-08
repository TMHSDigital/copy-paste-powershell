import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { root } from "../tools/lib/content.mjs";

const file = path.join(root, "assets/js/analytics.js");
vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
const scrub = globalThis.scrubSearchQuery;

test("search text keeps plain words, lowercased, two at most", () => {
  assert.equal(scrub("Unzip Files Fast"), "unzip files");
  assert.equal(scrub("  grep  "), "grep");
  assert.equal(scrub(""), "");
});

test("paths, emails, addresses, and IDs never leave the browser", () => {
  const cases = {
    "C:\\Users\\jsmith\\Desktop\\report.xlsx": "<path>",
    "\\\\fileserver01\\share": "<path>",
    "/srv/reports/notes.txt": "<path>",
    "~/Downloads": "<path>",
    "jane.doe@contoso.com": "<email>",
    "10.0.12.7": "<ip>",
    "fe80::1": "<ip>",
    "{6F9619FF-8B86-D011-B42D-00C04FC964FF}": "<guid>",
    "srv-app01.corp.contoso.com": "<name>",
    "PC123456": "<name>",
  };
  for (const [input, expected] of Object.entries(cases)) {
    assert.equal(scrub(input), expected, input);
    assert.equal(scrub(`find ${input}`), `find ${expected}`, `find ${input}`);
  }
});

test("output is short even for long input", () => {
  assert.ok(scrub("a".repeat(200)).length <= 40);
});
