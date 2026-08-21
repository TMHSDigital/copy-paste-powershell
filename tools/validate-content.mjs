import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function listMarkdown(dir, recursive = false) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...listMarkdown(full, true));
    } else if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_")) {
      files.push(full);
    }
  }
  return files;
}

function requireFields(file, data, fields) {
  for (const field of fields) {
    const value = data[field];
    const missing =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (field !== "aliases" && Array.isArray(value) && value.length === 0);
    if (missing) {
      errors.push(`${path.relative(root, file)}: missing required field '${field}'`);
    }
  }
}

function parse(file) {
  return matter(fs.readFileSync(file, "utf8"));
}

for (const file of listMarkdown(path.join(root, "commands"))) {
  const { data } = parse(file);
  requireFields(file, data, [
    "title",
    "cmdlet",
    "aliases",
    "category",
    "difficulty",
    "topics",
    "command",
  ]);
  if (data.aliases !== undefined && !Array.isArray(data.aliases)) {
    errors.push(`${path.relative(root, file)}: aliases must be an array`);
  }
  if (data.difficulty && !["beginner", "intermediate"].includes(data.difficulty)) {
    errors.push(`${path.relative(root, file)}: difficulty must be beginner or intermediate`);
  }
}

const scriptDirs = fs.existsSync(path.join(root, "scripts"))
  ? fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true }).filter((e) => e.isDirectory())
  : [];

for (const dirent of scriptDirs) {
  const dir = path.join(root, "scripts", dirent.name);
  const index = path.join(dir, "index.md");
  const ps1Files = fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".ps1"));
  if (!fs.existsSync(index)) {
    errors.push(`scripts/${dirent.name}/: missing index.md`);
    continue;
  }
  if (ps1Files.length === 0) {
    errors.push(`scripts/${dirent.name}/: missing .ps1 file`);
  }
  const { data } = parse(index);
  requireFields(index, data, ["title", "summary", "topics"]);
}

for (const file of listMarkdown(path.join(root, "builders"))) {
  const { data } = parse(file);
  requireFields(file, data, ["title", "summary", "fields", "template"]);
  if (!Array.isArray(data.fields) || data.fields.length === 0) {
    errors.push(`${path.relative(root, file)}: fields must be a non-empty array`);
  } else {
    for (const [i, field] of data.fields.entries()) {
      if (!field?.name || !field?.label || !field?.type) {
        errors.push(`${path.relative(root, file)}: fields[${i}] needs name, label, and type`);
      }
    }
  }
}

for (const file of listMarkdown(path.join(root, "guides"))) {
  const { data } = parse(file);
  requireFields(file, data, ["title", "summary", "order", "topics"]);
}

if (errors.length > 0) {
  console.error("Content validation failed:\n");
  for (const error of errors) {
    console.error(`  ${error}`);
  }
  process.exit(1);
}

console.log("Content validation passed.");
