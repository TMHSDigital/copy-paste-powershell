(function () {
  const root = document.documentElement;
  let base = root.dataset.base || "/";
  if (!base.endsWith("/")) {
    base += "/";
  }
  const indexUrl = new URL("search-index.json", window.location.origin + base).toString();
  const inputs = document.querySelectorAll("[data-search-input]");
  if (!inputs.length) {
    return;
  }

  let indexPromise = null;

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(indexUrl)
        .then((res) => res.json())
        .catch(() => ({ commands: [], scripts: [], builders: [], guides: [] }));
    }
    return indexPromise;
  }

  function haystack(item) {
    return [
      item.title,
      item.cmdlet,
      item.command,
      item.summary,
      item.category,
      ...(item.aliases || []),
      ...(item.topics || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function allItems(data, scope) {
    if (scope === "command") {
      return data.commands || [];
    }
    return [
      ...(data.commands || []),
      ...(data.scripts || []),
      ...(data.builders || []),
      ...(data.guides || []),
    ];
  }

  function resultHref(item) {
    const url = String(item.url || "");
    if (!url.startsWith("/")) {
      return "#";
    }
    return base.replace(/\/$/, "") + url;
  }

  function render(container, items) {
    if (!container) {
      return;
    }
    container.replaceChildren();
    container.hidden = false;
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "lede";
      empty.textContent = "No matches.";
      container.append(empty);
      return;
    }
    items.slice(0, 12).forEach((item) => {
      const a = document.createElement("a");
      a.href = resultHref(item);
      const type = document.createElement("span");
      type.className = "result-type";
      type.textContent = item.type || "";
      const strong = document.createElement("strong");
      strong.textContent = item.cmdlet || item.title || "";
      a.append(type, strong);
      if (item.title && item.cmdlet) {
        a.append(document.createTextNode(` ${item.title}`));
      }
      container.append(a);
    });
  }

  inputs.forEach((input) => {
    const scope = input.getAttribute("data-search-scope");
    const container =
      document.getElementById("search-results") ||
      document.querySelector(".search-results");

    input.addEventListener("input", async () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        if (container) {
          container.hidden = true;
          container.replaceChildren();
        }
        return;
      }
      const data = await loadIndex();
      const matches = allItems(data, scope).filter((item) => haystack(item).includes(q));
      render(container, matches);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const initial = params.get("q");
  if (initial) {
    inputs.forEach((input) => {
      input.value = initial;
      input.dispatchEvent(new Event("input"));
    });
  }
})();
