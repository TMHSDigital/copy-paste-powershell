import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";
import Prism from "prismjs";
import "prismjs/components/prism-powershell.js";

const CONTENT_GLOBS = {
  commands: "commands/*.md",
  scripts: "scripts/*/index.md",
  builders: "builders/*.md",
  guides: "guides/*.md",
};

function categoryLabel(slug) {
  const map = {
    files: "Files",
    text: "Text and objects",
    system: "System",
    network: "Network",
    help: "Help and discovery",
  };
  if (map[slug]) {
    return map[slug];
  }
  return String(slug || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function sortByTitle(a, b) {
  return String(a.data.title || "").localeCompare(String(b.data.title || ""), "en", {
    sensitivity: "base",
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CONTRIBUTING.md");
  eleventyConfig.ignores.add("NOTICE");
  eleventyConfig.ignores.add("LICENSE");
  eleventyConfig.ignores.add("commands/_template.md");
  eleventyConfig.ignores.add("scripts/_template.md");
  eleventyConfig.ignores.add("builders/_template.md");
  eleventyConfig.ignores.add(".playwright-mcp/**");
  eleventyConfig.ignores.add("tests/**");
  eleventyConfig.ignores.add("module/**");

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("scripts/**/*.ps1");
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-okaidia.css": "assets/vendor/prism.css",
  });

  eleventyConfig.addWatchTarget("commands/");
  eleventyConfig.addWatchTarget("scripts/");
  eleventyConfig.addWatchTarget("builders/");
  eleventyConfig.addWatchTarget("guides/");
  eleventyConfig.addWatchTarget("assets/");

  eleventyConfig.amendLibrary("md", (md) => {
    md.set({
      typographer: false,
      highlight: (code, lang) => {
        const language = lang && Prism.languages[lang] ? lang : "powershell";
        const grammar = Prism.languages[language];
        if (!grammar) {
          return md.utils.escapeHtml(code);
        }
        return Prism.highlight(code, grammar, language);
      },
    });
  });

  eleventyConfig.addCollection("commands", (api) => {
    return api.getFilteredByGlob(CONTENT_GLOBS.commands).sort(sortByTitle);
  });

  eleventyConfig.addCollection("scripts", (api) => {
    return api.getFilteredByGlob(CONTENT_GLOBS.scripts).sort(sortByTitle);
  });

  eleventyConfig.addCollection("builders", (api) => {
    return api.getFilteredByGlob(CONTENT_GLOBS.builders).sort(sortByTitle);
  });

  eleventyConfig.addCollection("guides", (api) => {
    return api.getFilteredByGlob(CONTENT_GLOBS.guides).sort((a, b) => {
      const order = (a.data.order ?? 100) - (b.data.order ?? 100);
      if (order !== 0) {
        return order;
      }
      return sortByTitle(a, b);
    });
  });

  eleventyConfig.addCollection("featuredCommands", (api) => {
    return api.getFilteredByGlob(CONTENT_GLOBS.commands)
      .filter((item) => item.data.featured)
      .sort(sortByTitle);
  });

  eleventyConfig.addCollection("commandCategories", (api) => {
    const items = api.getFilteredByGlob(CONTENT_GLOBS.commands);
    const counts = new Map();
    for (const item of items) {
      const slug = item.data.category;
      if (!slug) {
        continue;
      }
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([slug, count]) => ({ slug, label: categoryLabel(slug), count }))
      .sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));
  });

  eleventyConfig.addFilter("categoryLabel", categoryLabel);

  eleventyConfig.addFilter("relatedCommands", (collection, currentUrl, topics, limit = 5) => {
    const topicSet = new Set(topics || []);
    if (topicSet.size === 0) {
      return [];
    }
    return collection
      .filter((other) => other.url !== currentUrl)
      .map((other) => {
        const overlap = (other.data.topics || []).filter((topic) => topicSet.has(topic)).length;
        return { other, overlap };
      })
      .filter((entry) => entry.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || sortByTitle(a.other, b.other))
      .slice(0, limit)
      .map((entry) => entry.other);
  });

  eleventyConfig.addFilter("readSiblingPs1", (inputPath) => {
    if (!inputPath) {
      return "";
    }
    const dir = path.dirname(inputPath);
    if (!fs.existsSync(dir)) {
      return "";
    }
    const files = fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".ps1"));
    if (files.length === 0) {
      return "";
    }
    return fs.readFileSync(path.join(dir, files[0]), "utf8").replace(/^\uFEFF/, "");
  });

  eleventyConfig.addFilter("siblingPs1Name", (inputPath) => {
    if (!inputPath) {
      return "";
    }
    const dir = path.dirname(inputPath);
    if (!fs.existsSync(dir)) {
      return "";
    }
    const files = fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".ps1"));
    return files[0] || "";
  });

  eleventyConfig.addFilter("highlightPowershell", (code) => {
    if (!code) {
      return "";
    }
    return Prism.highlight(String(code), Prism.languages.powershell, "powershell");
  });

  // Safe inside <script> elements: "<" can never close the tag or open a comment.
  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026"),
  );

  eleventyConfig.addFilter("orEmpty", (value) => (value === undefined || value === null ? "" : value));

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
