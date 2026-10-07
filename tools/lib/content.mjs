import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import yaml from "js-yaml";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// Load the browser renderer without a DOM. It attaches itself to globalThis.
// Same realm on purpose, so assert.deepStrictEqual works on its results.
export function loadBuilderRender() {
  if (!globalThis.BuilderRender) {
    const file = path.join(root, "assets/js/builder-render.js");
    vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
  }
  return globalThis.BuilderRender;
}

export function listMarkdown(dir, { recursive = false } = {}) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) {
    return [];
  }
  const files = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...listMarkdown(rel, { recursive }));
    } else if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_")) {
      files.push(rel);
    }
  }
  return files.sort();
}

// Parse YAML the same way Eleventy does (js-yaml 4), so the tools and the
// site never disagree about what a frontmatter value is.
const MATTER_OPTIONS = { engines: { yaml: (text) => yaml.load(text) } };

export function readFrontmatter(rel) {
  return matter(fs.readFileSync(path.join(root, rel), "utf8"), MATTER_OPTIONS);
}

export function builderDefaults(spec) {
  const raw = {};
  for (const field of spec.fields || []) {
    raw[field.name] = field.type === "checkbox" ? Boolean(field.default) : field.default ?? "";
  }
  return raw;
}

// Inputs that used to break generated scripts (issue #3).
export const TRICKY_TEXT = [
  ".\\Reports $old",
  ".\\a`b",
  '.\\My "Docs"',
  "Bob's-",
  "Bob\u2019s-",
  ".\\photos [2024]",
  "$(Remove-Item C:\\ -Recurse)",
];

export function builderVariants(spec) {
  const base = builderDefaults(spec);
  const variants = [{ label: "defaults", raw: base }];
  // Flip every checkbox and walk every select option.
  const flipped = { ...base };
  for (const field of spec.fields || []) {
    if (field.type === "checkbox") {
      flipped[field.name] = !base[field.name];
    }
  }
  variants.push({ label: "checkboxes flipped", raw: flipped });
  for (const field of spec.fields || []) {
    if (field.type === "select") {
      for (const option of field.options || []) {
        variants.push({ label: `${field.name}=${option.value}`, raw: { ...base, [field.name]: option.value } });
      }
    }
  }
  TRICKY_TEXT.forEach((text, i) => {
    const raw = { ...base };
    for (const field of spec.fields || []) {
      if (!field.type || field.type === "text") {
        raw[field.name] = text;
      }
    }
    variants.push({ label: `tricky text #${i + 1}`, raw, tricky: text });
  });
  return variants;
}
