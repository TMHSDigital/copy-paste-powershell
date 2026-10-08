// Runs axe-core against representative built pages in light and dark mode.
//   npm run build:gh && node tools/a11y.mjs --prefix copy-paste-powershell
// Fails on serious or critical violations. Needs: npx playwright install chromium
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { root } from "./lib/content.mjs";

const site = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : path.join(root, "_site");
const prefixArg = process.argv.indexOf("--prefix");
const prefixName = prefixArg > -1 ? String(process.argv[prefixArg + 1] || "").replace(/^\/+|\/+$/g, "") : "";
const prefix = prefixName ? `/${prefixName}/` : "/";

const PAGES = [
  "",
  "commands/",
  "commands/get-childitem/",
  "commands/invoke-webrequest/",
  "scripts/",
  "scripts/rename-files/",
  "builders/",
  "builders/test-host/",
  "builders/scheduled-task/",
  "guides/",
  "guides/pipelines/",
  "from-bash/",
  "explain/?cmd=Get-ChildItem%20-Recurse%20%7C%20Remove-Item%20-Force",
  "cheat-sheet/",
  "404.html",
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

if (!fs.existsSync(site)) {
  console.error("a11y: _site/ does not exist. Run a build first.");
  process.exit(2);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith(prefix)) {
    res.writeHead(404).end();
    return;
  }
  let file = path.join(site, pathname.slice(prefix.length));
  if (!file.startsWith(site)) {
    res.writeHead(403).end();
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let failures = 0;
try {
  for (const colorScheme of ["light", "dark"]) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    for (const p of PAGES) {
      await page.goto(`${origin}${prefix}${p}`, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const label = `${colorScheme.padEnd(5)} /${p}`;
      if (serious.length) {
        failures += serious.length;
        console.error(`FAIL ${label}`);
        for (const v of serious) {
          console.error(`  [${v.impact}] ${v.id}: ${v.help}`);
          for (const node of v.nodes.slice(0, 3)) {
            console.error(`      ${node.target.join(" ")}  ${node.failureSummary.split("\n").slice(1, 2).join(" ").trim()}`);
          }
        }
      } else {
        console.log(`ok   ${label}`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures) {
  console.error(`\nAccessibility check failed: ${failures} serious or critical issue(s).`);
  process.exit(1);
}
console.log("\nAccessibility check passed.");
