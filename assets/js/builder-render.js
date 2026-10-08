// Shared by the browser (window.BuilderRender) and the Node tests.
// Keep it free of DOM access.
(function (root) {
  "use strict";

  // A PowerShell single-quoted literal: nothing inside expands, and a
  // single quote is escaped by doubling it. PowerShell also treats the
  // curly quotes as single quotes, so those are doubled too.
  function psQuote(value) {
    return "'" + String(value ?? "").replace(/['‘’‚‛]/g, (q) => q + q) + "'";
  }

  function optionValues(field) {
    return (field.options || []).map((option) => String(option.value));
  }

  // Returns { values, errors }. values holds what the template may use:
  // strings for text, booleans for checkboxes, plus `<name>_<option>` flags
  // for selects. Anything invalid is reported, never passed through raw.
  function normalize(spec, raw) {
    const values = {};
    const errors = {};
    for (const field of spec.fields || []) {
      const input = raw[field.name];
      if (field.type === "checkbox") {
        values[field.name] = input === true || input === "1" || input === "true" || input === "on";
        continue;
      }
      const text = input === undefined || input === null ? "" : String(input);
      if (field.type === "select") {
        const allowed = optionValues(field);
        const value = allowed.includes(text) ? text : String(field.default ?? allowed[0] ?? "");
        if (text && !allowed.includes(text)) {
          errors[field.name] = `${field.label}: pick one of the listed options.`;
        }
        values[field.name] = value;
        values[`${field.name}_${value.replace(/[^\w]/g, "_")}`] = true;
        continue;
      }
      if (field.required && text.trim() === "") {
        errors[field.name] = `${field.label} is required.`;
      }
      if (field.type === "number" && text.trim() !== "") {
        const n = Number(text);
        const min = field.min ?? -Infinity;
        const max = field.max ?? Infinity;
        if (!/^-?\d+$/.test(text.trim()) || n < min || n > max) {
          const range = Number.isFinite(min) && Number.isFinite(max) ? ` between ${min} and ${max}` : "";
          errors[field.name] = `${field.label} must be a whole number${range}.`;
        } else {
          values[field.name] = String(n);
          continue;
        }
      }
      if (field.type === "time" && text.trim() !== "" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(text.trim())) {
        errors[field.name] = `${field.label} must look like 09:30.`;
      }
      values[field.name] = field.type === "number" ? "" : text;
    }
    // requiredWhen: { otherField: value | [values] } makes a field required
    // only while every listed field has one of those values.
    for (const field of spec.fields || []) {
      if (!field.requiredWhen || errors[field.name] || String(values[field.name] ?? "").trim() !== "") {
        continue;
      }
      const applies = Object.entries(field.requiredWhen).every(([other, wanted]) => {
        const list = Array.isArray(wanted) ? wanted : [wanted];
        return list.some((w) => (typeof w === "boolean" ? values[other] === w : String(values[other]) === String(w)));
      });
      if (applies) {
        errors[field.name] = `${field.label} is required.`;
      }
    }
    return { values, errors };
  }

  function isTruthy(value) {
    return value === true || (typeof value === "string" && value.length > 0 && value !== "false");
  }

  // {{name}}       raw value (only for select, number, and checkbox fields)
  // {{name:q}}     single-quoted PowerShell literal
  // {{#name}}..{{/name}}  included when truthy
  // {{^name}}..{{/name}}  included when falsy
  //
  // Sections may nest when their names differ: each pass expands the first
  // section, and passes repeat until none is left. (A section inside one with
  // the same name cannot work; tools/validate-content.mjs rejects it.)
  function renderTemplate(template, data) {
    let out = String(template);
    for (let previous = null; previous !== out; ) {
      previous = out;
      out = out.replace(/\{\{([#^])(\w+)\}\}([\s\S]*?)\{\{\/\2\}\}/, (_, sigil, key, inner) => {
        return isTruthy(data[key]) === (sigil === "#") ? inner : "";
      });
    }
    out = out.replace(/\{\{(\w+)(:q)?\}\}/g, (_, key, quoted) => {
      const value = data[key];
      if (quoted) {
        return psQuote(value === true ? "true" : value === false ? "" : value);
      }
      if (value === true) {
        return "true";
      }
      if (value === false || value === undefined || value === null) {
        return "";
      }
      return String(value);
    });
    return out.replace(/\s+\n/g, "\n").trim() + "\n";
  }

  // Plain-English lines for whatever is switched on.
  function explain(spec, values) {
    const lines = [];
    for (const field of spec.fields || []) {
      const value = values[field.name];
      if (field.type === "select") {
        const option = (field.options || []).find((o) => String(o.value) === value);
        if (option && option.explain) {
          lines.push(option.explain);
        }
        continue;
      }
      if (!field.explain) {
        continue;
      }
      if (field.type === "checkbox" ? value === true : isTruthy(value)) {
        lines.push(String(field.explain).replace(/\{value\}/g, String(value)));
      } else if (field.type === "checkbox" && field.explainOff) {
        lines.push(field.explainOff);
      }
    }
    return lines;
  }

  function render(spec, raw) {
    const { values, errors } = normalize(spec, raw);
    const messages = Object.values(errors);
    if (messages.length) {
      return {
        script: messages.map((m) => `# Fix this first: ${m}`).join("\n") + "\n",
        errors,
        explanation: [],
      };
    }
    return { script: renderTemplate(spec.template, values), errors, explanation: explain(spec, values) };
  }

  root.BuilderRender = { psQuote, normalize, renderTemplate, explain, render };
})(typeof window !== "undefined" ? window : globalThis);
