const critical = require('critical')
const { JSDOM } = require('jsdom')

// Twelvety options
const twelvety = require('@12ty')

// Require local minify functions
const minify = require('./minify')

module.exports = function(config) {
  config.addTransform('critical', async function(content, outputPath) {
    if (outputPath.endsWith('.html') && twelvety.env === 'production') {
      const { css } = await critical.generate({
        base: 'dist/',
        html: content,
        minify: false,
        width: 2560,
        height: 1600
      })

      // Append critical styles using JSDOM
      const dom = new JSDOM(content)
      const { document } = dom.window
      const style = document.createElement('style')
      style.innerHTML = css
      document.head.appendChild(style)

      // Return serialized JSDOM
      return dom.serialize()
    }

    return content
  })

  config.addTransform('format', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return minify.html(content)
    }

    return content
  })

  // Add transforms here
}
