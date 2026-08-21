(function () {
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
    const original = button.textContent;
    button.textContent = label;
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  async function copyFrom(button, text) {
    try {
      await copyText(text);
      flash(button, "Copied");
    } catch {
      flash(button, "Failed");
    }
  }

  function sourceFromPre(pre) {
    const code = pre.querySelector("code");
    return (code || pre).innerText.replace(/\n$/, "");
  }

  document.querySelectorAll("button[data-copy]").forEach((button) => {
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

  document.querySelectorAll("main pre").forEach((pre) => {
    if (pre.closest(".copy-bar") || pre.closest(".terminal") || pre.querySelector(".copy-on-pre")) {
      return;
    }
    if (pre.id === "builder-preview" || pre.id === "script-source") {
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-small copy-on-pre";
    button.textContent = "Copy";
    button.addEventListener("click", () => {
      copyFrom(button, sourceFromPre(pre));
    });
    pre.appendChild(button);
  });
})();
