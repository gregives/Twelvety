// Require picture shortcode
const pictureShortcode = require('./shortcodes/picture')

// markdown-it
// Options: https://github.com/markdown-it/markdown-it#init-with-presets-and-options
module.exports = require('markdown-it')({
  html: true,
  breaks: true,
  typographer: true
})
  .use(function(md) {
    // Use picture shortcode for images in Markdown
    md.renderer.rules.image = function(tokens, index) {
      const token = tokens[index]
      const src = token.attrs[token.attrIndex('src')][1]
      const alt = token.content
      return pictureShortcode(src, alt)
    }
  })
