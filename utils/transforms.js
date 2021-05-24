const critical = require("eleventy-critical-css");
const append = require("./transforms/append");

// Twelvety options from .twelvety.js
const twelvety = require("@12ty");

// Require local minify functions
const minify = require("./minify");

module.exports = function (config) {
  config.addTransform("append", append);

  if (twelvety.env === "production") {
    config.addPlugin(critical, {
      base: twelvety.dir.output,
    });
  }

  config.addTransform("format", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return minify.html(content);
    }

    return content;
  });

  // Add transforms here
};
