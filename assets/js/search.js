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

  function render(container, items) {
    if (!container) {
      return;
    }
    if (!items.length) {
      container.hidden = false;
      container.innerHTML = "<p class=\"lede\">No matches.</p>";
      return;
    }
    container.hidden = false;
    container.innerHTML = items
      .slice(0, 12)
      .map((item) => {
        const label = item.cmdlet || item.title;
        return `<a href="${base.replace(/\/$/, "") + item.url}"><span class="result-type">${item.type}</span><strong>${label}</strong> ${item.title && item.cmdlet ? item.title : ""}</a>`;
      })
      .join("");
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
          container.innerHTML = "";
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
