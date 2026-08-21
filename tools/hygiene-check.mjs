import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_DIRS = ["commands", "scripts", "builders", "guides", "assets", "_includes", "_data"];
const SCAN_EXT = new Set([
  ".md",
  ".njk",
  ".html",
  ".js",
  ".css",
  ".json",
  ".ps1",
  ".psm1",
  ".yml",
  ".yaml",
  ".svg",
]);

const RULES = [
  { re: /C:\\Users\\/i, msg: "local Windows user path (C:\\Users\\)" },
  { re: /\/Users\/[^\s\\/]+/i, msg: "local macOS user path (/Users/...)" },
  { re: /password\s*=\s*['\"][^'\"]+/i, msg: "password assignment" },
  { re: /api[_-]?key\s*=\s*['\"][^'\"]+/i, msg: "API key assignment" },
  { re: /\bAKIA[0-9A-Z]{16}\b/, msg: "AWS access key id" },
  { re: /\bghp_[A-Za-z0-9]{20,}\b/, msg: "GitHub personal access token" },
  { re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/, msg: "GitHub fine-grained token" },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (SCAN_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

const hits = [];
for (const rel of SCAN_DIRS) {
  for (const file of walk(path.join(root, rel))) {
    const text = fs.readFileSync(file, "utf8");
    for (const rule of RULES) {
      if (rule.re.test(text)) {
        hits.push(`${path.relative(root, file)}: ${rule.msg}`);
      }
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
