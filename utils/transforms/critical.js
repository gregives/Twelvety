const { JSDOM } = require('jsdom')
const critical = require('critical')

// Twelvety options from .twelvety.js
const twelvety = require('@12ty')

module.exports = async function(content, outputPath) {
  if (outputPath.endsWith('.html') && twelvety.env === 'production') {
    const { css } = await critical.generate({
      base: twelvety.dir.output,
      html: content,
      minify: false,
      width: 2560,
      height: 1600
    })

    // Append critical styles to head using JSDOM
    const dom = new JSDOM(content)
    const { document } = dom.window
    const style = document.createElement('style')
    style.innerHTML = css
    document.head.appendChild(style)

    // Return serialized JSDOM
    return dom.serialize()
  }

  return content
}
