const append = require('./transforms/append')
const critical = require('./transforms/critical')

// Require local minify functions
const minify = require('./minify')

module.exports = function(config) {
  config.addTransform('append', append)
  config.addTransform('critical', critical)

  config.addTransform('format', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return minify.html(content)
    }

    return content
  })

  // Add transforms here
}
