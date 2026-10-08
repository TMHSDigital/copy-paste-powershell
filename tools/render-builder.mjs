// Renders one builder with chosen form values, so tests can run the output.
//   node tools/render-builder.mjs <builder-name> <values.json>
// values.json holds field values; fields left out keep their defaults.
// Prints the script on stdout. Exits 1 and prints the errors on stderr when
// the form would show validation errors.
import fs from "node:fs";
import { readFrontmatter, loadBuilderRender, builderDefaults } from "./lib/content.mjs";

const [name, valuesFile] = process.argv.slice(2);
if (!name) {
  console.error("usage: node tools/render-builder.mjs <builder-name> [values.json]");
  process.exit(2);
}

const R = loadBuilderRender();
const { data } = readFrontmatter(`builders/${name}.md`);
const values = valuesFile ? JSON.parse(fs.readFileSync(valuesFile, "utf8").replace(/^﻿/, "")) : {};
const result = R.render(data, { ...builderDefaults(data), ...values });

if (result.errors && Object.keys(result.errors).length) {
  console.error(JSON.stringify(result.errors));
  process.exit(1);
}
process.stdout.write(result.script);
