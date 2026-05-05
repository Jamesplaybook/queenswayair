const Image = require("@11ty/eleventy-img");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const path = require("path");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy({ "src/assets/img/favicon": "/" });

  // Responsive image shortcode
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, sizes, widths, classes) {
    const srcPath = src.startsWith("/") ? `src${src}` : src;
    const metadata = await Image(srcPath, {
      widths: widths || [400, 800, 1200, 1600],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/assets/img/",
      urlPath: "/assets/img/",
      filenameFormat: (_id, srcPath, width, format) => {
        const name = path.basename(srcPath, path.extname(srcPath));
        return `${name}-${width}.${format}`;
      },
    });
    const imageAttributes = {
      alt,
      sizes: sizes || "100vw",
      loading: "lazy",
      decoding: "async",
      class: classes || "",
    };
    return Image.generateHTML(metadata, imageAttributes);
  });

  // Hero image shortcode (eager, high priority)
  eleventyConfig.addAsyncShortcode("heroImage", async function (src, alt, sizes) {
    const srcPath = src.startsWith("/") ? `src${src}` : src;
    const metadata = await Image(srcPath, {
      widths: [800, 1200, 1600, 1920],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/assets/img/",
      urlPath: "/assets/img/",
    });
    const imageAttributes = {
      alt,
      sizes: sizes || "100vw",
      loading: "eager",
      fetchpriority: "high",
      decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
  });

  // Lucide icon shortcode — inlines SVG from lucide-static with class/size/a11y attrs
  const lucideDir = path.join(__dirname, "node_modules/lucide-static/icons");
  const iconCache = new Map();
  eleventyConfig.addShortcode("icon", function (name, classes = "icon", size = 24) {
    let svg = iconCache.get(name);
    if (!svg) {
      svg = fs.readFileSync(path.join(lucideDir, `${name}.svg`), "utf8");
      iconCache.set(name, svg);
    }
    // Lucide SVGs are multi-line; strip existing class/width/height then inject ours
    return svg
      .replace(/\s+class="[^"]*"/, "")
      .replace(/\s+width="[^"]*"/, "")
      .replace(/\s+height="[^"]*"/, "")
      .replace(/<svg/, `<svg class="${classes}" width="${size}" height="${size}" aria-hidden="true" focusable="false"`);
  });

  // Current year shortcode
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Date filters
  eleventyConfig.addFilter("dateISO", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
  });
  eleventyConfig.addFilter("dateHuman", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  });
  eleventyConfig.addFilter("dateYear", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.getFullYear();
  });

  // JSON stringify filter (for schema output)
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value, null, 2));

  // Collections
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/blog/posts/*.md").reverse()
  );
  eleventyConfig.addCollection("services", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/services/service.njk")
  );
  eleventyConfig.addCollection("areas", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/service-areas/area.njk")
  );
  eleventyConfig.addCollection("allPages", (collectionApi) =>
    collectionApi.getAll().filter((p) => !p.data.excludeFromSitemap)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
