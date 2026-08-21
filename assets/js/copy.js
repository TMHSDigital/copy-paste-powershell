(function () {
  function copyText(text) {
    return navigator.clipboard.writeText(text);
  }

  function flash(button) {
    const original = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  function sourceFromPre(pre) {
    const code = pre.querySelector("code");
    return (code || pre).innerText.replace(/\n$/, "");
  }

  document.querySelectorAll("button[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      await copyText(button.getAttribute("data-copy") || "");
      flash(button);
    });
  });

  document.querySelectorAll("button[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.getAttribute("data-copy-target"));
      if (!target) {
        return;
      }
      await copyText(sourceFromPre(target));
      flash(button);
    });
  });

  document.querySelectorAll("main pre").forEach((pre) => {
    if (pre.closest(".copy-bar") || pre.querySelector(".copy-on-pre")) {
      return;
    }
    if (pre.id === "builder-preview" || pre.id === "script-source") {
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-small copy-on-pre";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      await copyText(sourceFromPre(pre));
      flash(button);
    });
    pre.appendChild(button);
  });
})();
