// Renders assets/social.png (1280x640), the Open Graph / Twitter card image.
//   node tools/social-image.mjs
// Re-run after changing the site name or tagline, then commit the PNG.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { root } from "./lib/content.mjs";

const site = JSON.parse(fs.readFileSync(path.join(root, "_data/site.json"), "utf8"));
const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1280px; height: 640px; background: #012456; color: #fff;
         font-family: "Segoe UI", system-ui, sans-serif; display: flex; flex-direction: column;
         justify-content: center; padding: 0 96px; box-sizing: border-box; border-bottom: 24px solid #f2a900; }
  .mark { display: inline-block; background: #fff; color: #012456; font: 800 44px "Cascadia Code", Consolas, monospace;
          padding: 4px 18px; border-radius: 8px; width: fit-content; }
  h1 { font-size: 104px; line-height: 1; margin: 36px 0 24px; font-weight: 900; letter-spacing: -2px; }
  h1 span { color: #f2a900; display: block; }
  p { font-size: 38px; margin: 0; color: #dce4f2; max-width: 1000px; }
  .cmd { margin-top: 44px; font: 30px "Cascadia Code", Consolas, monospace; color: #e9eef8;
         background: #0b1730; border: 3px solid #6f7d92; border-radius: 10px; padding: 16px 24px; width: fit-content; }
  .cmd b { color: #f2a900; }
</style></head><body>
  <div class="mark">PS&gt;_</div>
  <h1><span>Copy-Paste</span> PowerShell</h1>
  <p>${escape(site.tagline)}</p>
  <div class="cmd"><b>PS&gt;</b> Remove-Item -Path .\\temp -Recurse -WhatIf</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
await page.setContent(html, { waitUntil: "networkidle" });
const out = path.join(root, "assets", "social.png");
await page.screenshot({ path: out });
await browser.close();
console.log(`Wrote ${path.relative(root, out)}`);
