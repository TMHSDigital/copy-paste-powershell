// Only loaded when site.json sets analytics.goatcounter. GoatCounter is
// cookie-free; events are counted as paths like "event/copy/get-childitem".
(function () {
  window.siteTrack = function (name, value) {
    const send = () => {
      if (!window.goatcounter || typeof window.goatcounter.count !== "function") {
        return false;
      }
      const slug = String(value || "")
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^\w./-]+/g, "-")
        .slice(0, 80);
      window.goatcounter.count({ path: `event/${name}/${slug}`, title: `${name}: ${value || ""}`, event: true });
      return true;
    };
    if (!send()) {
      // count.js loads async; try once more shortly after.
      window.setTimeout(send, 1500);
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[download]");
    if (link) {
      window.siteTrack("download", link.getAttribute("href"));
    }
  });
})();
