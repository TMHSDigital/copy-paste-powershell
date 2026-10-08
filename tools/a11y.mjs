// Runs axe-core against every built page (from sitemap.xml) in light and
// dark mode, plus a few extra states such as a prefilled Explain page.
//   npm run build:gh && node tools/a11y.mjs --prefix copy-paste-powershell
// Fails on moderate, serious, or critical violations.
// Needs: npx playwright install chromium
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

// Pages that are not in the sitemap, or states a plain visit does not show.
const EXTRA_PAGES = ["explain/?cmd=Get-ChildItem%20-Recurse%20%7C%20Remove-Item%20-Force", "404.html"];
const FAIL_ON = ["moderate", "serious", "critical"];

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

// Every <loc> in the sitemap, as a path relative to the site root.
const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const PAGES = [
  ...new Set([
    ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => {
      const { pathname } = new URL(loc);
      return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\//, "");
    }),
    ...EXTRA_PAGES,
  ]),
];

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
    // A few tabs at once; each takes the next page from the shared queue.
    const queue = [...PAGES];
    const worker = async () => {
      const page = await context.newPage();
      for (let p = queue.shift(); p !== undefined; p = queue.shift()) {
        await checkPage(page, colorScheme, p);
      }
    };
    await Promise.all(Array.from({ length: 4 }, worker));
    await context.close();
  }
  await checkKeyboard();
} finally {
  await browser.close();
  server.close();
}

if (failures) {
  console.error(`\nAccessibility check failed: ${failures} issue(s) across ${PAGES.length} pages.`);
  process.exit(1);
}
console.log(`\nAccessibility check passed (${PAGES.length} pages, light and dark).`);

// Keyboard behaviour axe cannot see.
async function checkKeyboard() {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${origin}${prefix}`, { waitUntil: "networkidle" });
  const search = page.locator("header input[type=search]").first();
  await search.fill("zip");
  const panel = page.locator(".search-results").first();
  await panel.waitFor({ state: "visible" });
  await search.focus();
  await page.keyboard.press("Shift+Tab");
  const closed = await panel.isHidden();
  console.log(`${closed ? "ok  " : "FAIL"} keyboard: search results close when focus leaves`);
  if (!closed) {
    failures++;
  }
  await context.close();
}

async function checkPage(page, colorScheme, p) {
  await page.goto(`${origin}${prefix}${p}`, { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const found = results.violations.filter((v) => FAIL_ON.includes(v.impact));
  const label = `${colorScheme.padEnd(5)} /${p}`;
  if (!found.length) {
    console.log(`ok   ${label}`);
    return;
  }
  failures += found.length;
  console.error(`FAIL ${label}`);
  for (const v of found) {
    console.error(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.error(`      ${node.target.join(" ")}  ${node.failureSummary.split("\n").slice(1, 2).join(" ").trim()}`);
    }
  }
}
