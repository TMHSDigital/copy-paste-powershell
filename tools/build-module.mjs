// Prepares the CopyPastePowerShell module for testing or publishing.
//   node tools/build-module.mjs
//       Writes module/CopyPastePowerShell/snippets.json (the command catalog
//       for Find-Snippet). The module then loads the scripts straight from
//       scripts/, so a repo checkout always runs the current code.
//   node tools/build-module.mjs --package 1.2.3 [--out dist]
//       Also writes a self-contained copy to <out>/CopyPastePowerShell, with
//       the scripts in Scripts/, help examples that use the function names,
//       and ModuleVersion set. Nothing tracked in the repo is changed.
import fs from "node:fs";
import path from "node:path";
import { root, listMarkdown, readFrontmatter } from "./lib/content.mjs";

const moduleDir = path.join(root, "module", "CopyPastePowerShell");
const site = JSON.parse(fs.readFileSync(path.join(root, "_data/site.json"), "utf8"));

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > -1 ? String(process.argv[i + 1] || "") : null;
}

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

const snippets = JSON.stringify({ siteUrl: site.url, repo: site.repo, commands }, null, 2) + "\n";
fs.writeFileSync(path.join(moduleDir, "snippets.json"), snippets);
console.log(`Wrote snippets.json (${commands.length} commands)`);

// Earlier versions packaged into module/CopyPastePowerShell/Scripts, and the
// module prefers that folder, so a leftover copy would hide edits to scripts/.
fs.rmSync(path.join(moduleDir, "Scripts"), { recursive: true, force: true });

const version = arg("--package");
if (version !== null) {
  const clean = version.replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+$/.test(clean)) {
    console.error("--package needs a version like 1.2.3");
    process.exit(2);
  }
  const outRoot = path.resolve(root, arg("--out") || "dist");
  const target = path.join(outRoot, "CopyPastePowerShell");
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.join(target, "Scripts"), { recursive: true });

  // Function name for each script, from the $scriptMap in the .psm1.
  const psm1 = fs.readFileSync(path.join(moduleDir, "CopyPastePowerShell.psm1"), "utf8");
  const functionFor = Object.fromEntries(
    [...psm1.matchAll(/'([A-Z][\w-]+)'\s*=\s*'([\w-]+)'/g)].map(([, fn, script]) => [script, fn]),
  );

  for (const dir of fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    const fn = functionFor[dir.name];
    if (!fn) {
      console.error(`scripts/${dir.name} is not in $scriptMap in CopyPastePowerShell.psm1`);
      process.exit(1);
    }
    const text = fs
      .readFileSync(path.join(root, "scripts", dir.name, `${dir.name}.ps1`), "utf8")
      // Help examples: .\remove-old-files.ps1 -Path ... becomes Remove-OldFile -Path ...
      .replaceAll(`.\\${dir.name}.ps1`, fn);
    fs.writeFileSync(path.join(target, "Scripts", `${dir.name}.ps1`), text);
  }

  fs.copyFileSync(path.join(moduleDir, "CopyPastePowerShell.psm1"), path.join(target, "CopyPastePowerShell.psm1"));
  fs.writeFileSync(path.join(target, "snippets.json"), snippets);
  const manifest = fs
    .readFileSync(path.join(moduleDir, "CopyPastePowerShell.psd1"), "utf8")
    .replace(/ModuleVersion\s*=\s*'[^']*'/, `ModuleVersion        = '${clean}'`);
  fs.writeFileSync(path.join(target, "CopyPastePowerShell.psd1"), manifest);
  for (const file of ["LICENSE", "NOTICE"]) {
    fs.copyFileSync(path.join(root, file), path.join(target, file));
  }
  console.log(`Packaged CopyPastePowerShell ${clean} into ${path.relative(root, target)}`);
}
