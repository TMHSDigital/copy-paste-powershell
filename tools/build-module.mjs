// Prepares module/CopyPastePowerShell for testing or publishing:
//   - writes snippets.json (the command catalog for Find-Snippet)
//   - with --package <version>: copies the scripts into Scripts/ and sets ModuleVersion
//   node tools/build-module.mjs [--package 1.2.3]
import fs from "node:fs";
import path from "node:path";
import { root, listMarkdown, readFrontmatter } from "./lib/content.mjs";

const moduleDir = path.join(root, "module", "CopyPastePowerShell");
const site = JSON.parse(fs.readFileSync(path.join(root, "_data/site.json"), "utf8"));

const commands = listMarkdown("commands").map((file) => {
  const { data } = readFrontmatter(file);
  const slug = path.basename(file, ".md");
  return {
    cmdlet: data.cmdlet,
    title: data.title,
    summary: data.summary || "",
    command: data.command,
    aliases: data.aliases || [],
    topics: data.topics || [],
    equivalents: Object.entries(data.equivalents || {})
      .filter(([key]) => key === "bash" || key === "cmd")
      .map(([, value]) => value),
    url: `/commands/${slug}/`,
  };
});

fs.writeFileSync(
  path.join(moduleDir, "snippets.json"),
  JSON.stringify({ siteUrl: site.url, repo: site.repo, commands }, null, 2) + "\n",
);
console.log(`Wrote snippets.json (${commands.length} commands)`);

const pkg = process.argv.indexOf("--package");
if (pkg > -1) {
  const version = String(process.argv[pkg + 1] || "").replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error("--package needs a version like 1.2.3");
    process.exit(2);
  }
  const target = path.join(moduleDir, "Scripts");
  fs.mkdirSync(target, { recursive: true });
  for (const dir of fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true })) {
    if (dir.isDirectory()) {
      const src = path.join(root, "scripts", dir.name, `${dir.name}.ps1`);
      fs.copyFileSync(src, path.join(target, `${dir.name}.ps1`));
    }
  }
  const manifest = path.join(moduleDir, "CopyPastePowerShell.psd1");
  const text = fs.readFileSync(manifest, "utf8").replace(/ModuleVersion\s*=\s*'[^']*'/, `ModuleVersion        = '${version}'`);
  fs.writeFileSync(manifest, text);
  console.log(`Packaged scripts into Scripts/ and set ModuleVersion ${version}`);
}
