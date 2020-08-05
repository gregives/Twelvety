const minify = require('./minify')

module.exports = function(config, options) {
  config.addTransform('format', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return minify.html(options, content)
    }

    return content
  })

  // Add transforms here
}
