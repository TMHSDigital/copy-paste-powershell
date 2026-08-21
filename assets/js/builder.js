(function () {
  const specNode = document.getElementById("builder-spec");
  const form = document.getElementById("builder-form");
  const preview = document.querySelector("#builder-preview code");
  const download = document.getElementById("builder-download");
  if (!specNode || !form || !preview) {
    return;
  }

  const spec = JSON.parse(specNode.textContent);

  function values() {
    const data = {};
    (spec.fields || []).forEach((field) => {
      const el = form.elements.namedItem(field.name);
      if (!el) {
        data[field.name] = "";
        return;
      }
      if (field.type === "checkbox") {
        data[field.name] = Boolean(el.checked);
      } else {
        data[field.name] = el.value;
        if (field.type === "select") {
          const flag = `${field.name}_${String(el.value).replace(/[^\w]/g, "_")}`;
          data[flag] = true;
        }
      }
    });
    return data;
  }

  function isTruthy(value) {
    return value === true || (typeof value === "string" && value.length > 0 && value !== "false");
  }

  function renderTemplate(template, data) {
    let out = template.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, inner) => {
      return isTruthy(data[key]) ? inner : "";
    });
    out = out.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, inner) => {
      return isTruthy(data[key]) ? "" : inner;
    });
    out = out.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = data[key];
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

  function refresh() {
    preview.textContent = renderTemplate(spec.template, values());
  }

  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);
  refresh();

  if (download) {
    download.addEventListener("click", () => {
      const blob = new Blob([preview.textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = spec.filename || "script.ps1";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
})();
