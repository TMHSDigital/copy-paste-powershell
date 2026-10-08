// Checks every internal link and asset reference in the built site.
//   node tools/check-links.mjs [--prefix copy-paste-powershell]
// Run after a build. External links are not fetched.
import fs from "node:fs";
import path from "node:path";
import { root } from "./lib/content.mjs";

const site = path.join(root, "_site");
const prefixArg = process.argv.indexOf("--prefix");
// Leading/trailing slashes are optional so Git Bash cannot mangle the argument.
const prefixName = prefixArg > -1 ? String(process.argv[prefixArg + 1] || "").replace(/^\/+|\/+$/g, "") : "";
const prefix = prefixName ? `/${prefixName}/` : "/";

if (!fs.existsSync(site)) {
  console.error("check-links: _site/ does not exist. Run a build first.");
  process.exit(2);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const idCache = new Map();
function idsIn(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

function resolveTarget(fromFile, url) {
  let pathname = url;
  if (pathname.startsWith("/")) {
    if (!pathname.startsWith(prefix)) {
      return { error: `does not start with the path prefix ${prefix}` };
    }
    pathname = pathname.slice(prefix.length);
    return { file: path.join(site, decodeURIComponent(pathname)) };
  }
  return { file: path.join(path.dirname(fromFile), decodeURIComponent(pathname)) };
}

function existing(file) {
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    return file;
  }
  const index = path.join(file, "index.html");
  return fs.existsSync(index) ? index : null;
}

const problems = [];
let checked = 0;

for (const file of walk(site)) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(site, file).replace(/\\/g, "/");
  for (const match of html.matchAll(/\s(?:href|src|action)="([^"]*)"/g)) {
    const raw = match[1].replace(/&amp;/g, "&");
    if (!raw || /^(https?:|mailto:|data:|javascript:|tel:)/i.test(raw) || raw.startsWith("//")) {
      continue;
    }
    checked++;
    const [beforeHash, hash] = raw.split("#");
    const pathPart = beforeHash.split("?")[0];
    let target = file;
    if (pathPart) {
      const resolved = resolveTarget(file, pathPart);
      if (resolved.error) {
        problems.push(`${rel}: ${raw} ${resolved.error}`);
        continue;
      }
      target = existing(resolved.file);
      if (!target) {
        problems.push(`${rel}: ${raw} points to a page or file that does not exist`);
        continue;
      }
    }
    if (hash && target.endsWith(".html") && !idsIn(target).has(decodeURIComponent(hash))) {
      problems.push(`${rel}: ${raw} links to #${hash}, which is not an id on that page`);
    }
  }
}

if (problems.length) {
  console.error(`Link check failed (${problems.length} problem(s) in ${checked} links):\n`);
  for (const problem of problems.slice(0, 50)) {
    console.error(`  ${problem}`);
  }
  if (problems.length > 50) {
    console.error(`  ...and ${problems.length - 50} more`);
  }
  process.exit(1);
}

console.log(`Link check passed (${checked} internal links).`);
