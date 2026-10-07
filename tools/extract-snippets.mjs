// Writes every PowerShell snippet on the site to a JSON file so
// tests/Snippets.Tests.ps1 can run each one through the PowerShell parser.
//   node tools/extract-snippets.mjs <out.json>
import fs from "node:fs";
import path from "node:path";
import { root, listMarkdown, readFrontmatter, loadBuilderRender, builderVariants } from "./lib/content.mjs";

const R = loadBuilderRender();
const snippets = [];

function fencedBlocks(body) {
  const blocks = [];
  const re = /^```(powershell|pwsh|ps1|ps)\s*\n([\s\S]*?)^```/gim;
  let match;
  while ((match = re.exec(body))) {
    blocks.push(match[2]);
  }
  return blocks;
}

function addPage(file, extra = []) {
  const { data, content } = readFrontmatter(file);
  for (const code of extra.map((key) => data[key]).filter(Boolean)) {
    snippets.push({ source: file, label: "frontmatter", code: String(code) });
  }
  fencedBlocks(content).forEach((code, i) => {
    snippets.push({ source: file, label: `block ${i + 1}`, code });
  });
  return data;
}

for (const file of listMarkdown("commands")) {
  const data = addPage(file, ["command"]);
  for (const [shell, code] of Object.entries(data.equivalents || {})) {
    if (shell === "powershell" && code) {
      snippets.push({ source: file, label: "equivalents.powershell", code: String(code) });
    }
  }
}
for (const file of listMarkdown("guides")) {
  addPage(file);
}
for (const file of listMarkdown("scripts", { recursive: true })) {
  addPage(file);
}
for (const file of listMarkdown("builders")) {
  const { data } = readFrontmatter(file);
  for (const variant of builderVariants(data)) {
    const result = R.render(data, variant.raw);
    snippets.push({ source: file, label: variant.label, code: result.script, tricky: variant.tricky || null });
  }
}

const out = process.argv[2];
if (!out) {
  console.error("usage: node tools/extract-snippets.mjs <out.json>");
  process.exit(2);
}
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify(snippets, null, 2));
console.log(`Wrote ${snippets.length} snippets to ${path.relative(root, path.resolve(out)) || out}`);
