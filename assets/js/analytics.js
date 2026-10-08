// Only loaded when site.json sets analytics.goatcounter. GoatCounter is
// cookie-free; events are counted as paths like "event/copy/get-childitem".
// scrubSearchQuery has no DOM access, so tests/analytics.test.mjs can load it.
(function (root) {
  "use strict";

  // People paste paths, server names, and addresses into the search box. Keep
  // only what helps find missing content: the first two words, lowercased,
  // with anything that looks personal replaced by a placeholder.
  function scrubSearchQuery(q) {
    const words = String(q || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        if (/^[a-z]:[\\/]|^\\\\|^~?\/|[\\/].*[\\/]/i.test(word)) {
          return "<path>";
        }
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(word)) {
          return "<email>";
        }
        if (/^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(word) || /^[0-9a-f]{0,4}(:[0-9a-f]{0,4}){2,7}$/i.test(word)) {
          return "<ip>";
        }
        if (/^\{?[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\}?$/i.test(word)) {
          return "<guid>";
        }
        if (/^[a-z0-9_-]+\.[a-z0-9.-]*\.[a-z]{2,}$/i.test(word) || /\d{4,}/.test(word)) {
          return "<name>";
        }
        return word.toLowerCase();
      });
    return words.slice(0, 2).join(" ").slice(0, 40);
  }

  root.scrubSearchQuery = scrubSearchQuery;

  if (typeof document === "undefined") {
    return;
  }

  root.siteTrack = function (name, value) {
    const text = name.startsWith("search") ? scrubSearchQuery(value) : String(value || "");
    if (!text) {
      return;
    }
    const send = () => {
      if (!root.goatcounter || typeof root.goatcounter.count !== "function") {
        return false;
      }
      const slug = text
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^\w./<>-]+/g, "-")
        .slice(0, 80);
      root.goatcounter.count({ path: `event/${name}/${slug}`, title: `${name}: ${text}`, event: true });
      return true;
    };
    if (!send()) {
      // count.js loads async; try once more shortly after.
      root.setTimeout(send, 1500);
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[download]");
    if (link) {
      root.siteTrack("download", link.getAttribute("href"));
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
