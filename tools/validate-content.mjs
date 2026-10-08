import fs from "node:fs";
import path from "node:path";
import { root, listMarkdown, readFrontmatter } from "./lib/content.mjs";

const errors = [];
const warnings = [];

const KNOWN_CATEGORIES = ["files", "text", "system", "network", "help"];
const PLATFORMS = ["windows", "linux", "macos"];
const FIELD_TYPES = ["text", "number", "time", "checkbox", "select"];
const FEATURED_COUNT = 6;

function fail(file, message) {
  errors.push(`${file}: ${message}`);
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
      fail(file, `missing required field '${field}'`);
    }
  }
}

function forbidEleventyTags(file, data) {
  if (Object.prototype.hasOwnProperty.call(data, "tags")) {
    fail(file, "use 'topics' for keywords, not Eleventy 'tags'");
  }
}

function optionalString(file, data, key) {
  if (data[key] !== undefined && typeof data[key] !== "string") {
    fail(file, `'${key}' must be a string`);
  }
}

// ---- commands -------------------------------------------------------------

const cmdlets = new Map();
let featured = 0;

for (const file of listMarkdown("commands")) {
  const { data } = readFrontmatter(file);
  forbidEleventyTags(file, data);
  requireFields(file, data, ["title", "cmdlet", "aliases", "category", "difficulty", "topics", "command", "summary", "module", "platforms"]);
  if (data.aliases !== undefined && !Array.isArray(data.aliases)) {
    fail(file, "aliases must be an array");
  }
  if (data.difficulty && !["beginner", "intermediate"].includes(data.difficulty)) {
    fail(file, "difficulty must be beginner or intermediate");
  }
  if (data.category && !KNOWN_CATEGORIES.includes(data.category)) {
    warnings.push(`${file}: new category '${data.category}'. Fine if intended; check for typos (known: ${KNOWN_CATEGORIES.join(", ")}).`);
  }
  if (data.cmdlet) {
    const key = String(data.cmdlet).toLowerCase();
    if (cmdlets.has(key)) {
      fail(file, `cmdlet '${data.cmdlet}' is already covered by ${cmdlets.get(key)}`);
    }
    cmdlets.set(key, file);
  }
  if (data.featured === true) {
    featured++;
  }

  if (data.platforms !== undefined) {
    if (!Array.isArray(data.platforms) || data.platforms.length === 0 || data.platforms.some((p) => !PLATFORMS.includes(p))) {
      fail(file, `platforms must be a non-empty list of: ${PLATFORMS.join(", ")}`);
    }
  }
  if (data.admin !== undefined && typeof data.admin !== "boolean") {
    fail(file, "admin must be true or false");
  }
  for (const key of ["module", "minVersion", "output", "docs"]) {
    optionalString(file, data, key);
  }
  if (data.docs && !/^https:\/\//.test(data.docs)) {
    fail(file, "docs must be an https URL");
  }
  if (data.notes !== undefined) {
    if (typeof data.notes !== "object" || Array.isArray(data.notes)) {
      fail(file, 'notes must be a map, for example { "7": "text" }');
    } else {
      for (const key of Object.keys(data.notes)) {
        if (!["5.1", "7", "all"].includes(key)) {
          fail(file, `notes key '${key}' must be "5.1", "7", or "all"`);
        }
      }
    }
  }
  if (data.equivalents !== undefined) {
    if (typeof data.equivalents !== "object" || Array.isArray(data.equivalents)) {
      fail(file, "equivalents must be a map with bash and/or cmd keys");
    } else {
      for (const [shell, value] of Object.entries(data.equivalents)) {
        if (!["bash", "cmd", "powershell", "note"].includes(shell)) {
          fail(file, `equivalents.${shell} is not a known key (bash, cmd, powershell, note)`);
        }
        if (typeof value !== "string" || !value.trim()) {
          fail(file, `equivalents.${shell} must be a non-empty string`);
        }
      }
    }
  }
}

if (featured !== FEATURED_COUNT) {
  errors.push(`commands/: ${featured} commands have featured: true; the home page shows exactly ${FEATURED_COUNT}`);
}

// ---- scripts --------------------------------------------------------------

const scriptsDir = path.join(root, "scripts");
const scriptDirs = fs.existsSync(scriptsDir)
  ? fs.readdirSync(scriptsDir, { withFileTypes: true }).filter((e) => e.isDirectory())
  : [];

for (const dirent of scriptDirs) {
  const rel = `scripts/${dirent.name}/`;
  const dir = path.join(scriptsDir, dirent.name);
  const index = path.join(dir, "index.md");
  const ps1Files = fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".ps1"));
  if (!fs.existsSync(index)) {
    fail(rel, "missing index.md");
    continue;
  }
  if (ps1Files.length !== 1) {
    fail(rel, `needs exactly one .ps1 file, found ${ps1Files.length}`);
  } else if (ps1Files[0] !== `${dirent.name}.ps1`) {
    fail(rel, `script should be named ${dirent.name}.ps1 to match its folder`);
  }
  const indexRel = `${rel}index.md`;
  const { data } = readFrontmatter(indexRel);
  forbidEleventyTags(indexRel, data);
  requireFields(indexRel, data, ["title", "summary", "topics"]);
  if (data.parameters !== undefined) {
    if (!Array.isArray(data.parameters)) {
      fail(indexRel, "parameters must be a list");
    } else {
      data.parameters.forEach((param, i) => {
        if (!param?.name || !param?.type || typeof param?.required !== "boolean" || !param?.description) {
          fail(indexRel, `parameters[${i}] needs name, type, required (true/false), and description`);
        }
      });
    }
  }
  // Parameter names are cross-checked against the param() block by
  // tests/Scripts.Tests.ps1, which uses the real PowerShell parser.
}

// ---- builders -------------------------------------------------------------

for (const file of listMarkdown("builders")) {
  const { data } = readFrontmatter(file);
  forbidEleventyTags(file, data);
  requireFields(file, data, ["title", "summary", "fields", "template"]);
  if (!Array.isArray(data.fields) || data.fields.length === 0) {
    fail(file, "fields must be a non-empty array");
    continue;
  }

  const byName = new Map();
  const flags = new Set();
  data.fields.forEach((field, i) => {
    if (!field?.name || !field?.label || !field?.type) {
      fail(file, `fields[${i}] needs name, label, and type`);
      return;
    }
    if (!/^\w+$/.test(field.name)) {
      fail(file, `field '${field.name}' may only use letters, digits, and _`);
    }
    if (byName.has(field.name)) {
      fail(file, `duplicate field name '${field.name}'`);
    }
    byName.set(field.name, field);
    if (!FIELD_TYPES.includes(field.type)) {
      fail(file, `field '${field.name}' has unknown type '${field.type}' (use ${FIELD_TYPES.join(", ")})`);
    }
    if (field.type === "select") {
      if (!Array.isArray(field.options) || field.options.length === 0) {
        fail(file, `select field '${field.name}' needs options`);
      } else {
        const values = field.options.map((o) => String(o?.value ?? ""));
        if (values.some((v) => v === "")) {
          fail(file, `select field '${field.name}' has an option without a value`);
        }
        if (field.default !== undefined && !values.includes(String(field.default))) {
          fail(file, `select field '${field.name}' default '${field.default}' is not one of its options`);
        }
        values.forEach((v) => flags.add(`${field.name}_${v.replace(/[^\w]/g, "_")}`));
      }
    }
    if (field.type === "number" && field.min !== undefined && field.max !== undefined && field.min > field.max) {
      fail(file, `number field '${field.name}' has min greater than max`);
    }
  });

  const template = String(data.template || "");
  const tokenRe = /\{\{([#^/]?)(\w+)(:q)?\}\}/g;
  let match;
  while ((match = tokenRe.exec(template))) {
    const [, sigil, name, quoted] = match;
    const field = byName.get(name);
    if (!field && !flags.has(name)) {
      fail(file, `template uses {{${sigil}${name}${quoted || ""}}} but there is no field '${name}'`);
      continue;
    }
    if (field && !sigil && !quoted && (field.type === "text" || !field.type)) {
      fail(file, `text field '${name}' must be inserted as {{${name}:q}} so it is quoted for PowerShell`);
    }
    if (field && quoted && field.type === "checkbox") {
      fail(file, `checkbox '${name}' cannot be quoted; use {{#${name}}}...{{/${name}}}`);
    }
  }
  // Sections must close in order, and a section may not sit inside another
  // section with the same name (the renderer cannot tell them apart).
  const open = [];
  for (const [, sigil, name] of template.matchAll(/\{\{([#^/])(\w+)\}\}/g)) {
    if (sigil !== "/") {
      if (open.includes(name)) {
        fail(file, `section {{${sigil}${name}}} is nested inside another '${name}' section`);
      }
      open.push(name);
    } else if (open.at(-1) === name) {
      open.pop();
    } else {
      fail(file, `{{/${name}}} closes ${open.length ? `'${open.at(-1)}'` : "nothing"}`);
    }
  }
  if (open.length) {
    fail(file, `unclosed section(s): ${open.join(", ")}`);
  }
  for (const field of data.fields) {
    for (const other of Object.keys(field?.requiredWhen || {})) {
      if (!byName.has(other)) {
        fail(file, `field '${field.name}' requiredWhen names unknown field '${other}'`);
      }
    }
  }
  const unclosed = template.match(/\{\{(?![#^/]?\w+(:q)?\}\})[^}]*\}\}/g);
  if (unclosed) {
    fail(file, `template has malformed placeholders: ${unclosed.join(", ")}`);
  }
}

// ---- guides ---------------------------------------------------------------

for (const file of listMarkdown("guides")) {
  const { data } = readFrontmatter(file);
  forbidEleventyTags(file, data);
  requireFields(file, data, ["title", "summary", "order", "topics"]);
}

for (const warning of warnings) {
  console.warn(`warning: ${warning}`);
}

if (errors.length > 0) {
  console.error("Content validation failed:\n");
  for (const error of errors) {
    console.error(`  ${error}`);
  }
  process.exit(1);
}

console.log("Content validation passed.");
