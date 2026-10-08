(function () {
  const root = document.documentElement;
  let base = root.dataset.base || "/";
  if (!base.endsWith("/")) {
    base += "/";
  }
  const indexUrl = new URL("search-index.json", window.location.origin + base).toString();
  const MAX_RESULTS = 10;

  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(indexUrl)
        .then((res) => res.json())
        .catch(() => ({ commands: [], scripts: [], builders: [], guides: [], pages: [] }));
    }
    return indexPromise;
  }

  function announce(message) {
    const status = document.getElementById("site-status");
    if (status) {
      status.textContent = "";
      window.setTimeout(() => {
        status.textContent = message;
      }, 50);
    }
  }

  function track(name, value) {
    if (window.siteTrack) {
      window.siteTrack(name, value);
    }
  }

  // Count a search that found nothing once the visitor stops typing, not on
  // every keystroke. analytics.js scrubs the text before it is sent.
  let noResultsTimer = null;
  function trackNoResults(q) {
    window.clearTimeout(noResultsTimer);
    noResultsTimer = window.setTimeout(() => track("search-no-results", q), 1500);
  }
  function cancelNoResults() {
    window.clearTimeout(noResultsTimer);
  }

  function tokens(q) {
    return q.toLowerCase().split(/\s+/).filter(Boolean);
  }

  function lower(value) {
    return String(value || "").toLowerCase();
  }

  // Higher is better. Every query word must appear somewhere, or the item is out.
  function score(item, q, words) {
    const cmdlet = lower(item.cmdlet);
    const title = lower(item.title);
    const aliases = (item.aliases || []).map(lower);
    const topics = (item.topics || []).map(lower);
    const equivalents = (item.equivalents || []).map(lower);
    const haystack = [cmdlet, title, lower(item.summary), lower(item.command), lower(item.category), ...aliases, ...topics, ...equivalents].join(" ");
    if (!words.every((w) => haystack.includes(w))) {
      return 0;
    }
    let s = 1;
    if (cmdlet && cmdlet === q) s += 100;
    if (aliases.includes(q)) s += 90;
    if (equivalents.some((e) => e === q || e.split(/\s+/)[0] === q)) s += 80;
    if (cmdlet && cmdlet.startsWith(q)) s += 60;
    if (title === q) s += 50;
    if (title.includes(q)) s += 30;
    for (const w of words) {
      if (cmdlet.includes(w)) s += 10;
      if (title.includes(w)) s += 8;
      if (topics.includes(w)) s += 5;
    }
    if (item.type === "command") s += 3;
    return s;
  }

  function search(data, q, scope) {
    const words = tokens(q);
    const pool =
      scope === "command"
        ? data.commands || []
        : [...(data.commands || []), ...(data.scripts || []), ...(data.builders || []), ...(data.guides || []), ...(data.pages || [])];
    return pool
      .map((item) => ({ item, s: score(item, q.toLowerCase().trim(), words) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || lower(a.item.title).localeCompare(lower(b.item.title)))
      .map((r) => r.item);
  }

  function resultHref(item) {
    const url = String(item.url || "");
    if (!url.startsWith("/")) {
      return "#";
    }
    return base.replace(/\/$/, "") + url;
  }

  // ---- dropdown search (header, home) ----------------------------------

  let panelCount = 0;

  function setupDropdown(input) {
    const form = input.closest("form");
    const scope = input.getAttribute("data-search-scope");
    const panel = document.createElement("div");
    panel.className = "search-results";
    panel.id = `search-results-${++panelCount}`;
    panel.hidden = true;
    if (input.hasAttribute("data-search-overlay")) {
      panel.classList.add("search-results-overlay");
    }
    (form || input).insertAdjacentElement("afterend", panel);
    // Results are announced through #site-status and reached with the
    // arrow keys as ordinary links, so this is not an ARIA combobox.
    input.setAttribute("aria-controls", panel.id);

    let current = [];

    function close() {
      panel.hidden = true;
    }

    function links() {
      return [...panel.querySelectorAll("a")];
    }

    function render(items, q) {
      current = items;
      panel.replaceChildren();
      panel.hidden = false;
      if (!items.length) {
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = `No matches for "${q}". `;
        const ask = document.createElement("a");
        ask.href = `${document.documentElement.dataset.repo || ""}/issues/new?template=request-command.yml&title=${encodeURIComponent(`Request: ${q}`)}`;
        ask.textContent = "Ask for it";
        empty.append(ask);
        panel.append(empty);
        announce("No results");
        trackNoResults(q);
        return;
      }
      cancelNoResults();
      const list = document.createElement("ul");
      items.slice(0, MAX_RESULTS).forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = resultHref(item);
        const type = document.createElement("span");
        type.className = "result-type";
        type.textContent = item.type || "";
        const name = document.createElement("strong");
        name.textContent = item.cmdlet || item.title || "";
        a.append(type, name);
        if (item.cmdlet && item.title) {
          const title = document.createElement("span");
          title.className = "result-title";
          title.textContent = item.title;
          a.append(title);
        }
        li.append(a);
        list.append(li);
      });
      panel.append(list);
      const shown = Math.min(items.length, MAX_RESULTS);
      announce(`${shown} result${shown === 1 ? "" : "s"}${items.length > shown ? ` of ${items.length}` : ""}`);
    }

    async function update() {
      const q = input.value.trim();
      if (!q) {
        current = [];
        panel.replaceChildren();
        close();
        return;
      }
      const data = await loadIndex();
      if (input.value.trim() !== q) {
        return;
      }
      render(search(data, q, scope), q);
    }

    input.addEventListener("input", update);
    input.addEventListener("focus", () => {
      if (input.value.trim()) {
        update();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        const first = links()[0];
        if (first) {
          event.preventDefault();
          first.focus();
        }
      } else if (event.key === "Escape") {
        if (!panel.hidden) {
          event.preventDefault();
          close();
        } else {
          input.value = "";
        }
      } else if (event.key === "Enter" && current.length) {
        event.preventDefault();
        window.location.href = resultHref(current[0]);
      }
    });

    panel.addEventListener("keydown", (event) => {
      const all = links();
      const i = all.indexOf(document.activeElement);
      if (event.key === "ArrowDown" && i > -1) {
        event.preventDefault();
        (all[i + 1] || all[i]).focus();
      } else if (event.key === "ArrowUp" && i > -1) {
        event.preventDefault();
        (i === 0 ? input : all[i - 1]).focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
        input.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!panel.contains(event.target) && event.target !== input) {
        close();
      }
    });

    // Tabbing away from both the box and the results closes them, so the
    // overlay never covers the page the keyboard moved to. Only when focus
    // lands somewhere else: Safari does not focus links on click, and the
    // click handler above covers mouse use.
    for (const el of [input, panel]) {
      el.addEventListener("focusout", (event) => {
        const next = event.relatedTarget;
        if (next && next !== input && !panel.contains(next)) {
          close();
        }
      });
    }

    return { input, update };
  }

  // ---- in-page filter (/commands/) -------------------------------------

  function setupFilter(input) {
    const items = [...document.querySelectorAll("[data-search-item]")];
    const sections = [...document.querySelectorAll("[data-filter-section]")];
    const toggles = [...document.querySelectorAll("[data-filter-toggle]")];
    const empty = document.getElementById("filter-empty");
    const count = document.getElementById("filter-count");

    function apply() {
      const q = input.value.trim().toLowerCase();
      const words = tokens(q);
      const required = toggles.filter((t) => t.checked).map((t) => t.getAttribute("data-filter-toggle"));
      let visible = 0;
      for (const item of items) {
        const text = item.getAttribute("data-search-text") || item.textContent.toLowerCase();
        const flags = (item.getAttribute("data-flags") || "").split(" ");
        const show = words.every((w) => text.includes(w)) && required.every((r) => flags.includes(r));
        item.hidden = !show;
        if (show) {
          visible++;
        }
      }
      for (const section of sections) {
        section.hidden = !section.querySelector("[data-search-item]:not([hidden])");
      }
      if (empty) {
        empty.hidden = visible > 0;
      }
      const filtered = words.length > 0 || required.length > 0;
      if (count) {
        count.textContent = filtered ? `${visible} of ${items.length} commands` : `${items.length} commands`;
      }
      if (filtered) {
        announce(`${visible} command${visible === 1 ? "" : "s"} shown`);
      }
      if (filtered && visible === 0 && q) {
        trackNoResults(q);
      } else {
        cancelNoResults();
      }
    }

    input.addEventListener("input", apply);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        apply();
      }
    });
    toggles.forEach((t) => t.addEventListener("change", apply));
    return { input, update: apply };
  }

  const controllers = [...document.querySelectorAll("[data-search-input]")].map((input) =>
    input.getAttribute("data-search-mode") === "filter" ? setupFilter(input) : setupDropdown(input),
  );

  // ?q= fills the page's main search box (not the header) and runs it.
  const initial = new URLSearchParams(window.location.search).get("q");
  if (initial) {
    const target = controllers.find((c) => c.input.hasAttribute("data-search-primary")) || controllers[0];
    if (target) {
      target.input.value = initial;
      target.update();
    }
  }
})();
