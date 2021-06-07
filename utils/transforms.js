const append = require("./transforms/append");

// Require local minify functions
const minify = require("./minify");

module.exports = function (config) {
  config.addTransform("append", append);

  config.addTransform("format", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return minify.html(content);
    }

    return content;
  });

  // Add transforms here
};
