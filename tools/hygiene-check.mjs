import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { root } from "./lib/content.mjs";

const SCAN_EXT = new Set([
  ".md",
  ".njk",
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".ps1",
  ".psm1",
  ".psd1",
  ".yml",
  ".yaml",
  ".svg",
  ".txt",
]);

// Files whose whole job is to describe these patterns.
const ALLOW = new Set(["tools/hygiene-check.mjs"]);

const RULES = [
  { re: /C:\\Users\\/i, msg: "local Windows user path (C:\\Users\\)" },
  { re: /(^|[\s"'`(])\/Users\/[^\s\\/]+/im, msg: "local macOS user path (/Users/...)" },
  { re: /\/home\/(?!runner\b)[a-z][\w.-]*\//, msg: "local Linux home path (/home/...)" },
  { re: /password\s*=\s*['"][^'"]+/i, msg: "password assignment" },
  { re: /api[_-]?key\s*=\s*['"][^'"]+/i, msg: "API key assignment" },
  { re: /\bAKIA[0-9A-Z]{16}\b/, msg: "AWS access key id" },
  { re: /\bghp_[A-Za-z0-9]{20,}\b/, msg: "GitHub personal access token" },
  { re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/, msg: "GitHub fine-grained token" },
  { re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/, msg: "Slack token" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, msg: "private key" },
];

// Scan everything git tracks or would track (untracked but not ignored),
// so new folders are covered without editing this list.
function candidateFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
      cwd: root,
      encoding: "utf8",
    });
    return out.split("\0").filter(Boolean);
  } catch {
    console.error("hygiene: git is not available; cannot list files.");
    process.exit(2);
  }
}

const hits = [];
for (const rel of candidateFiles()) {
  const posix = rel.replace(/\\/g, "/");
  if (ALLOW.has(posix) || !SCAN_EXT.has(path.extname(rel).toLowerCase())) {
    continue;
  }
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    continue;
  }
  const text = fs.readFileSync(full, "utf8");
  for (const rule of RULES) {
    if (rule.re.test(text)) {
      hits.push(`${posix}: ${rule.msg}`);
    }
  }
}

if (hits.length > 0) {
  console.error("Hygiene check failed:\n");
  for (const hit of hits) {
    console.error(`  ${hit}`);
  }
  process.exit(1);
}

console.log("Hygiene check passed.");
