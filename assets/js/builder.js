(function () {
  const specNode = document.getElementById("builder-spec");
  const form = document.getElementById("builder-form");
  const preview = document.querySelector("#builder-preview code");
  const download = document.getElementById("builder-download");
  const shareButton = document.getElementById("builder-share");
  const explainList = document.getElementById("builder-explain");
  const sharedNote = document.getElementById("builder-shared-note");
  if (!specNode || !form || !preview || !window.BuilderRender) {
    return;
  }

  const spec = JSON.parse(specNode.textContent);
  const fields = spec.fields || [];

  function defaultFor(field) {
    if (field.type === "checkbox") {
      return field.default ? "1" : "0";
    }
    return field.default === undefined || field.default === null ? "" : String(field.default);
  }

  function readForm() {
    const raw = {};
    fields.forEach((field) => {
      const el = form.elements.namedItem(field.name);
      if (!el) {
        return;
      }
      raw[field.name] = field.type === "checkbox" ? Boolean(el.checked) : el.value;
    });
    return raw;
  }

  // Shared links restore form state. Values are never trusted: render()
  // quotes text and rejects selects or numbers that are not allowed. A link
  // can never switch off a safety checkbox (safety: true, such as "Preview
  // only"), and the note lists every field the link changed.
  function applyQuery() {
    const params = new URLSearchParams(window.location.search);
    const changed = [];
    let safetyKept = false;
    let remote = false;
    fields.forEach((field) => {
      if (!params.has(field.name)) {
        return;
      }
      const el = form.elements.namedItem(field.name);
      if (!el) {
        return;
      }
      const value = params.get(field.name);
      if (field.type === "checkbox") {
        if (field.safety) {
          safetyKept = safetyKept || (value === "1") !== Boolean(field.default);
          return;
        }
        el.checked = value === "1";
      } else if (field.type === "select") {
        if (!(field.options || []).some((o) => String(o.value) === value)) {
          return;
        }
        el.value = value;
      } else {
        el.value = value;
        remote = remote || /^(\\\\|\/\/|[a-z][a-z0-9+.-]*:\/\/)/i.test(value.trim());
      }
      if (value !== defaultFor(field)) {
        changed.push(field.label);
      }
    });
    if ((changed.length || safetyKept) && sharedNote) {
      const extra = [];
      if (changed.length) {
        extra.push(`The link set: ${changed.join(", ")}.`);
      }
      if (safetyKept) {
        extra.push("It also tried to turn off the preview. A link cannot do that, so preview is still on; switch it off yourself once you have read the script.");
      }
      if (remote) {
        extra.push("A path points to another computer or a web address. Only keep it if you know and trust that location.");
      }
      sharedNote.append(` ${extra.join(" ")}`);
      sharedNote.hidden = false;
    }
  }

  function syncQuery(raw) {
    const params = new URLSearchParams();
    fields.forEach((field) => {
      const value = field.type === "checkbox" ? (raw[field.name] ? "1" : "0") : String(raw[field.name] ?? "");
      if (value !== defaultFor(field)) {
        params.set(field.name, value);
      }
    });
    const query = params.toString();
    const url = window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }

  function showErrors(errors) {
    fields.forEach((field) => {
      const el = form.elements.namedItem(field.name);
      const message = document.getElementById(`error-${field.name}`);
      const error = errors[field.name];
      if (el && el.setAttribute) {
        if (error) {
          el.setAttribute("aria-invalid", "true");
        } else {
          el.removeAttribute("aria-invalid");
        }
      }
      if (message) {
        message.textContent = error || "";
        message.hidden = !error;
      }
    });
  }

  function showExplanation(lines) {
    if (!explainList) {
      return;
    }
    explainList.replaceChildren(
      ...lines.map((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        return li;
      }),
    );
    explainList.closest(".builder-explain").hidden = lines.length === 0;
  }

  let lastErrors = {};

  function refresh() {
    const raw = readForm();
    const result = window.BuilderRender.render(spec, raw);
    lastErrors = result.errors;
    preview.textContent = result.script;
    showErrors(result.errors);
    showExplanation(result.explanation);
    syncQuery(raw);
  }

  applyQuery();
  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);
  form.addEventListener("submit", (event) => event.preventDefault());
  refresh();

  if (download) {
    download.addEventListener("click", () => {
      const firstError = Object.keys(lastErrors)[0];
      if (firstError) {
        // Say why nothing downloaded, and take the visitor to the field.
        const field = form.elements.namedItem(firstError);
        if (field && field.focus) {
          field.focus();
        }
        const status = document.getElementById("site-status");
        if (status) {
          status.textContent = `Fix the form first: ${lastErrors[firstError]}`;
        }
        return;
      }
      const blob = new Blob([preview.textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = spec.filename || "script.ps1";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoking in the same tick can cancel the download in some browsers.
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      if (window.siteTrack) {
        window.siteTrack("builder-download", spec.filename);
      }
    });
  }

  if (shareButton) {
    shareButton.setAttribute("data-copy", window.location.href);
    form.addEventListener("input", () => shareButton.setAttribute("data-copy", window.location.href));
    form.addEventListener("change", () => shareButton.setAttribute("data-copy", window.location.href));
  }
})();
