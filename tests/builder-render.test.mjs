import test from "node:test";
import assert from "node:assert/strict";
import { loadBuilderRender, listMarkdown, readFrontmatter, builderVariants } from "../tools/lib/content.mjs";

const R = loadBuilderRender();

test("psQuote wraps in single quotes and doubles single quotes", () => {
  assert.equal(R.psQuote("plain"), "'plain'");
  assert.equal(R.psQuote("Bob's"), "'Bob''s'");
  assert.equal(R.psQuote("Bob\u2019s"), "'Bob\u2019\u2019s'");
  assert.equal(R.psQuote("$old `n \"x\""), "'$old `n \"x\"'");
  assert.equal(R.psQuote(""), "''");
  assert.equal(R.psQuote(undefined), "''");
});

test("{{name:q}} quotes, {{name}} is raw, sections toggle", () => {
  const out = R.renderTemplate("A {{p:q}}{{#on}} -X{{/on}}{{^on}} -Y{{/on}} {{n}}", { p: "it's", on: false, n: "5" });
  assert.equal(out, "A 'it''s' -Y 5\n");
});

test("select values outside the option list are rejected, never inserted", () => {
  const spec = {
    fields: [{ name: "action", label: "Action", type: "select", default: "Copy-Item", options: [{ value: "Copy-Item" }, { value: "Move-Item" }] }],
    template: "{{action}} x",
  };
  const result = R.render(spec, { action: "Remove-Item C:\\ -Recurse;" });
  assert.ok(result.errors.action);
  assert.doesNotMatch(result.script, /Remove-Item/);
});

test("number fields enforce whole numbers in range", () => {
  const spec = { fields: [{ name: "port", label: "Port", type: "number", min: 1, max: 65535 }], template: "-Port {{port}}" };
  assert.equal(R.render(spec, { port: "443" }).script, "-Port 443\n");
  for (const bad of ["443 abc", "0", "70000", "1.5", "; Remove-Item x"]) {
    const result = R.render(spec, { port: bad });
    assert.ok(result.errors.port, `expected an error for ${bad}`);
    assert.match(result.script, /^# Fix this first/);
  }
});

test("time fields must be HH:MM", () => {
  const spec = { fields: [{ name: "t", label: "Time", type: "time" }], template: "{{t}}" };
  assert.equal(R.render(spec, { t: "09:30" }).script, "09:30\n");
  assert.ok(R.render(spec, { t: "9am'; x" }).errors.t);
});

test("required text fields report an error when empty", () => {
  const spec = { fields: [{ name: "p", label: "Folder", type: "text", required: true }], template: "{{p:q}}" };
  assert.ok(R.render(spec, { p: "  " }).errors.p);
});

test("explain lists lines for active fields and the chosen option", () => {
  const spec = {
    fields: [
      { name: "r", type: "checkbox", explain: "recurse on", explainOff: "recurse off" },
      { name: "f", type: "text", explain: "filter {value}" },
      { name: "a", type: "select", options: [{ value: "x", explain: "chose x" }] },
    ],
    template: "",
  };
  assert.deepEqual(R.explain(spec, { r: false, f: "*.md", a: "x" }), ["recurse off", "filter *.md", "chose x"]);
});

for (const file of listMarkdown("builders")) {
  const { data } = readFrontmatter(file);
  test(`${file}: every variant renders without errors and keeps tricky text inside one literal`, () => {
    for (const variant of builderVariants(data)) {
      const result = R.render(data, variant.raw);
      assert.deepEqual(result.errors, {}, `${variant.label}: ${JSON.stringify(result.errors)}`);
      if (variant.tricky) {
        assert.ok(
          result.script.includes(R.psQuote(variant.tricky)),
          `${variant.label}: expected ${R.psQuote(variant.tricky)} in\n${result.script}`,
        );
      }
    }
  });
}

test("sections nest when their names differ", () => {
  const t = "A{{#x}}[x{{#y}} y{{/y}}{{^y}} not-y{{/y}}]{{/x}}B";
  assert.equal(R.renderTemplate(t, { x: true, y: true }), "A[x y]B\n");
  assert.equal(R.renderTemplate(t, { x: true, y: false }), "A[x not-y]B\n");
  assert.equal(R.renderTemplate(t, { x: false, y: true }), "AB\n");
});

test("requiredWhen only requires a field for the listed choices", () => {
  const spec = {
    fields: [
      { name: "freq", label: "When", type: "select", default: "daily", options: [{ value: "daily" }, { value: "logon" }] },
      { name: "tcp", label: "TCP", type: "checkbox" },
      { name: "time", label: "Time", type: "time", requiredWhen: { freq: ["daily"] } },
      { name: "port", label: "Port", type: "number", min: 1, max: 9, requiredWhen: { tcp: true } },
    ],
    template: "{{time}} {{port}}",
  };
  assert.ok(R.render(spec, { freq: "daily", time: "" }).errors.time);
  assert.equal(R.render(spec, { freq: "logon", time: "" }).errors.time, undefined);
  assert.ok(R.render(spec, { freq: "logon", tcp: true, port: "" }).errors.port);
  assert.equal(R.render(spec, { freq: "logon", tcp: false, port: "" }).errors.port, undefined);
});

test("no builder renders a dangling parameter or an empty -At", () => {
  for (const file of listMarkdown("builders")) {
    const { data } = readFrontmatter(file);
    // Clear one field at a time, since clearing a required one only shows an error.
    const blankable = (data.fields || []).filter((f) => f.type !== "select" && f.type !== "checkbox");
    for (const variant of builderVariants(data)) {
      for (const raw of [variant.raw, ...blankable.map((f) => ({ ...variant.raw, [f.name]: "" }))]) {
        const result = R.render(data, raw);
        if (Object.keys(result.errors).length) {
          continue;
        }
        // Parameters that need a value must never end a line or get ''.
        assert.doesNotMatch(result.script, /-(At|Port|Filter|Path|LiteralPath|Destination|DestinationPath|ComputerName|TaskName|NewName)(\s*$| '')/m, `${file} (${variant.label}) renders a parameter with no value:\n${result.script}`);
      }
    }
  }
});

test("copy builder: Move never gets -Recurse", () => {
  const { data } = readFrontmatter("builders/copy-files.md");
  const move = R.render(data, { action: "Move-Item", source: "a", destination: "b", recurse: true });
  assert.doesNotMatch(move.script, /-Recurse/);
  const copy = R.render(data, { action: "Copy-Item", source: "a", destination: "b", recurse: true });
  assert.match(copy.script, /-Recurse/);
});
