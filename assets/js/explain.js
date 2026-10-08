// "Explain a command" page. Everything happens in the browser; nothing is executed.
(function () {
  const input = document.getElementById("explain-input");
  const stepsWrap = document.getElementById("explain-steps-wrap");
  const stepsList = document.getElementById("explain-steps");
  const risksWrap = document.getElementById("explain-risks");
  const riskList = document.getElementById("explain-risk-list");
  if (!input || !stepsList || !window.ExplainRisks) {
    return;
  }

  const root = document.documentElement;
  let base = root.dataset.base || "/";
  if (!base.endsWith("/")) {
    base += "/";
  }
  const repo = root.dataset.repo || "";

  // Common parameters, in plain English.
  const PARAMS = {
    path: "the file or folder to work on (wildcards like * allowed)",
    literalpath: "the exact file or folder name, with no wildcard expansion",
    recurse: "also go into every subfolder",
    force: "include hidden or read-only items and skip some safety prompts",
    filter: "only items whose names match this pattern",
    include: "only items matching these patterns",
    exclude: "skip items matching these patterns",
    whatif: "preview only: show what would happen, change nothing",
    confirm: "ask before each change",
    file: "files only, no folders",
    directory: "folders only, no files",
    erroraction: "what to do when an error happens (Stop, Continue, SilentlyContinue)",
    verbose: "print extra detail about what it is doing",
    name: "the name to look for or use",
    value: "the value to write",
    encoding: "which text encoding to read or write",
    notypeinformation: "leave the #TYPE header line out of the CSV",
    property: "which properties (columns) to use",
    first: "only the first N items",
    last: "only the last N items",
    descending: "sort largest or newest first",
    unique: "drop duplicates",
    count: "how many times (for example, how many pings)",
    quiet: "return just True or False",
    uri: "the web address to call",
    method: "the HTTP method (GET, POST, ...)",
    outfile: "save the response to this file",
    destination: "where to copy or move to",
    append: "add to the end of the file instead of replacing it",
    raw: "read the whole file as one string instead of line by line",
    tail: "only the last N lines",
    wait: "keep watching for new lines (like tail -f)",
    usebasicparsing: "skip the old Internet Explorer engine (only matters on Windows PowerShell 5.1)",
    computername: "which computer to run it against",
    executionpolicy: "the script policy for this one session",
    scope: "where the setting applies (Process, CurrentUser, LocalMachine)",
    pattern: "the text or regular expression to search for",
    simplematch: "treat the pattern as plain text, not a regex",
    casesensitive: "make the match case-sensitive",
    itemtype: "what kind of item to create (File or Directory)",
    newname: "the new name",
    passthru: "output the changed item so you can keep piping it",
  };

  let commandsPromise = null;
  function loadCommands() {
    if (!commandsPromise) {
      commandsPromise = fetch(new URL("search-index.json", window.location.origin + base))
        .then((res) => res.json())
        .then((data) => {
          const map = new Map();
          for (const item of data.commands || []) {
            map.set(String(item.cmdlet).toLowerCase(), item);
            for (const alias of item.aliases || []) {
              if (!map.has(String(alias).toLowerCase())) {
                map.set(String(alias).toLowerCase(), item);
              }
            }
          }
          return map;
        })
        .catch(() => new Map());
    }
    return commandsPromise;
  }

  // Top-level words of one segment, keeping quoted strings and blocks together.
  function words(segment) {
    const out = [];
    let current = "";
    let depth = 0;
    let quote = null;
    for (const ch of segment) {
      if (quote) {
        current += ch;
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === "'" || ch === '"') {
        quote = ch;
        current += ch;
      } else if ("{([".includes(ch)) {
        depth++;
        current += ch;
      } else if ("})]".includes(ch)) {
        depth = Math.max(0, depth - 1);
        current += ch;
      } else if (depth === 0 && /\s/.test(ch)) {
        if (current) out.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    if (current) out.push(current);
    return out;
  }

  function el(tag, props, children) {
    const node = document.createElement(tag);
    Object.assign(node, props || {});
    for (const child of [].concat(children || [])) {
      node.append(child);
    }
    return node;
  }

  function code(text) {
    return el("code", { textContent: text });
  }

  function describeSegment(segment, index, commands) {
    const parts = words(segment.text);
    let name = parts[0] || "";
    if (name === "&" || name === ".") {
      name = parts[1] || name;
      parts.shift();
    }
    const known = commands.get(name.toLowerCase().replace(/^['"]|['"]$/g, ""));
    const li = el("li", { className: "explain-step" });
    li.append(el("h3", {}, [`${index + 1}. `, code(name)]));

    if (name.startsWith("$")) {
      li.append(el("p", { textContent: "Works with a variable: a named value stored earlier in the session." }));
    } else if (known) {
      const p = el("p", {}, [known.title + ". "]);
      if (known.cmdlet.toLowerCase() !== name.toLowerCase()) {
        p.append(code(name), ` is short for `, code(known.cmdlet), ". ");
      }
      p.append(el("a", { href: base.replace(/\/$/, "") + known.url, textContent: `Read the ${known.cmdlet} page` }));
      li.append(p);
      if (known.admin) {
        li.append(el("p", { textContent: "Usually needs PowerShell opened as administrator." }));
      }
    } else if (/^[a-z]+-[a-z0-9]+$/i.test(name)) {
      li.classList.add("is-unknown");
      li.append(
        el("p", {}, [
          "Not on this site yet. ",
          el("a", { href: `https://learn.microsoft.com/search/?terms=${encodeURIComponent(name)}`, textContent: "Look it up on Microsoft Learn" }),
          " or ",
          el("a", { href: `${repo}/issues/new?template=request-command.yml&title=${encodeURIComponent(`Request: ${name}`)}`, textContent: "ask us to add it" }),
          ".",
        ]),
      );
    } else {
      li.classList.add("is-unknown");
      li.append(el("p", { textContent: "Not a PowerShell cmdlet this site knows. It may be a program (like ping.exe), a function, or an alias defined on that computer." }));
    }

    const details = el("ul");
    for (const word of parts.slice(1)) {
      if (/^-[a-z]/i.test(word)) {
        const key = word.slice(1).replace(/:.*$/, "").toLowerCase();
        const meaning = PARAMS[key];
        details.append(el("li", {}, [code(word), meaning ? `: ${meaning}.` : ": a parameter of this command."]));
      } else if (word.startsWith("{")) {
        const body = word.slice(1, -1).trim();
        details.append(el("li", {}, ["Runs this for each item: ", code(body.length > 80 ? `${body.slice(0, 77)}...` : body), body.includes("$_") ? ". $_ is the current item." : "."]));
      }
    }
    if (details.children.length) {
      li.append(details);
    }
    if (index > 0 && segment.prev && segment.prev.piped) {
      li.prepend(el("p", { className: "kicker", textContent: "Takes the output of the previous step" }));
    }
    return li;
  }

  async function update() {
    const text = input.value.trim();
    if (!text) {
      stepsWrap.hidden = true;
      risksWrap.hidden = true;
      return;
    }
    const commands = await loadCommands();
    const result = window.ExplainRisks.assess(text);
    const segments = window.ExplainRisks.splitPipeline(result.normalized);
    segments.forEach((s, i) => {
      s.prev = segments[i - 1];
    });
    const steps = segments.map((s, i) => describeSegment(s, i, commands));
    stepsList.replaceChildren(...steps);
    stepsWrap.hidden = segments.length === 0;

    // A step we cannot name could do anything, so never sound reassuring
    // about a command that has one.
    const unknown = steps.filter((li) => li.classList.contains("is-unknown")).map((li) => li.querySelector("h3 code").textContent);
    let risks = result.risks;
    if (unknown.length) {
      risks = risks.filter((r) => r.level !== "info");
    }
    const warnings = risks.filter((r) => r.level !== "info").length;
    if (unknown.length) {
      const names = [...new Set(unknown)].join(", ");
      risks.push({
        level: "medium",
        text: `${unknown.length === 1 ? "One step is" : `${unknown.length} steps are`} not a command this site knows (${names}). Look ${unknown.length === 1 ? "it" : "them"} up before you run this. What we cannot read, we cannot warn you about.`,
      });
    } else if (!warnings) {
      risks.push({ level: "info", text: "Nothing on our list of risky patterns. That is not a guarantee; read each step." });
    }
    if (result.changed) {
      risks.push({
        level: "info",
        text: `This text has ${result.changed} typographic dash or quote character${result.changed === 1 ? "" : "s"} (often added by web pages and chat apps). PowerShell reads them as plain - ' and ", and so do these checks.`,
      });
    }
    riskList.replaceChildren(
      ...risks.map((r) => el("li", { className: r.level === "high" ? "" : r.level === "medium" ? "risk-medium" : "risk-info", textContent: r.text })),
    );
    risksWrap.hidden = false;
    announceSummary(segments.length, risks.filter((r) => r.level !== "info").length);
  }

  // Screen readers get one short summary once typing pauses, not the whole
  // output on every keystroke. The details are in the page to read.
  let announceTimer = null;
  function announceSummary(steps, warnings) {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      const status = document.getElementById("site-status");
      if (status) {
        const warned = warnings ? `${warnings} warning${warnings === 1 ? "" : "s"} under Before you run it.` : "No warnings.";
        status.textContent = `${steps} step${steps === 1 ? "" : "s"}. ${warned}`;
      }
    }, 1000);
  }

  let timer = null;
  input.addEventListener("input", () => {
    window.clearTimeout(timer);
    window.clearTimeout(announceTimer);
    timer = window.setTimeout(update, 150);
  });

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.getAttribute("data-example");
      update();
      input.focus();
    });
  });

  const initial = new URLSearchParams(window.location.search).get("cmd");
  if (initial) {
    input.value = initial;
    const fromLink = document.getElementById("explain-from-link");
    if (fromLink) {
      fromLink.hidden = false;
    }
    update();
  }
})();
