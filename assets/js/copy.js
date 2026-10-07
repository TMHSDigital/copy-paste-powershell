(function () {
  function announce(message) {
    const status = document.getElementById("site-status");
    if (status) {
      status.textContent = "";
      window.setTimeout(() => {
        status.textContent = message;
      }, 50);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      ta.remove();
    }
    if (!ok) {
      throw new Error("copy failed");
    }
  }

  function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    try {
      fallbackCopy(text);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function flash(button, label) {
    const original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = label;
    window.clearTimeout(Number(button.dataset.timer));
    button.dataset.timer = String(
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200),
    );
  }

  async function copyFrom(button, text) {
    try {
      await copyText(text);
      flash(button, "Copied");
      announce("Copied to clipboard");
      if (window.siteTrack) {
        window.siteTrack(button.getAttribute("data-track") || "copy", button.getAttribute("data-track-value") || window.location.pathname);
      }
    } catch {
      flash(button, "Failed");
      announce("Copy failed. Select the text and press Ctrl+C.");
    }
  }

  function sourceFromPre(pre) {
    const code = pre.querySelector("code");
    return (code || pre).innerText.replace(/\n$/, "");
  }

  // A short, readable label for screen readers: "Copy Get-ChildItem -Path .\docs".
  function describe(text) {
    const firstLine = String(text).split("\n")[0].trim();
    return firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
  }

  document.querySelectorAll("button[data-copy]").forEach((button) => {
    if (!button.hasAttribute("aria-label")) {
      button.setAttribute("aria-label", `Copy ${describe(button.getAttribute("data-copy") || "")}`);
    }
    button.addEventListener("click", () => {
      copyFrom(button, button.getAttribute("data-copy") || "");
    });
  });

  document.querySelectorAll("button[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.getAttribute("data-copy-target"));
      if (!target) {
        return;
      }
      copyFrom(button, sourceFromPre(target));
    });
  });

  // Code and tables that scroll sideways must be reachable by keyboard.
  function makeScrollableFocusable() {
    document.querySelectorAll("main pre, main .table-wrap").forEach((el) => {
      if (el.hasAttribute("data-always-focusable")) {
        return;
      }
      if (el.scrollWidth > el.clientWidth + 1) {
        if (!el.hasAttribute("tabindex")) {
          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "region");
          el.setAttribute("aria-label", el.matches("pre") ? "Code, scrolls sideways" : "Table, scrolls sideways");
        }
      } else if (el.getAttribute("role") === "region" && el.getAttribute("tabindex") === "0") {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      }
    });
  }
  makeScrollableFocusable();
  window.addEventListener("resize", makeScrollableFocusable);

  document.querySelectorAll("main pre").forEach((pre) => {
    if (pre.closest(".copy-bar") || pre.closest(".terminal") || pre.querySelector(".copy-on-pre")) {
      return;
    }
    if (pre.id === "builder-preview" || pre.id === "script-source" || pre.closest(".no-copy")) {
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-small copy-on-pre";
    button.textContent = "Copy";
    button.setAttribute("aria-label", `Copy ${describe(sourceFromPre(pre))}`);
    button.addEventListener("click", () => {
      copyFrom(button, sourceFromPre(pre));
    });
    pre.appendChild(button);
  });
})();
