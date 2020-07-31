const path = require('path')
const sass = require('node-sass')
const postcss = require('postcss')
const postcssPresetEnv = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')

// Render sass using node-sass
// Documentation: https://github.com/sass/node-sass
function renderSass(data) {
  return sass
    .renderSync({
      data,
      includePaths: [
        // Allow `@import` from files within src/_assets/styles
        path.resolve(process.cwd(), 'src', '_assets', 'styles')
      ],
      // Set `indentedSyntax` to true if you want to use indented sass
      indentedSyntax: false
    })
    .css
    .toString()
}

module.exports = function(config) {
  // Each stylesheet is stored within an array for its given 'chunk'
  const STYLES = {}

  // Store each stylesheet within its chunk
  // The chunk defaults to the URL of the current page
  config.addPairedShortcode('stylesheet', function(content, _language, chunk = this.page.url) {
    // Make sure that the chunk exists
    if (!STYLES.hasOwnProperty(chunk))
      STYLES[chunk] = []

    // Add the stylesheet to the chunk, if it's not already in it
    if (!STYLES[chunk].includes(content))
      STYLES[chunk].push(content)
  })

  // Render the stylesheets for the given chunk
  config.addShortcode('styles', async function(chunk = this.page.url) {
    // Convert sass to CSS and join all the stylesheets in the chunk
    const render = STYLES[chunk].map(renderSass).join('\n')

    // Use autoprefixer and postcss-preset-env for compatibility
    const styles = await postcss([postcssPresetEnv, autoprefixer]).process(render)

    // Return the styles inline
    return `<style>${styles}</style>`
  })

  // Reset all styles on re-runs
  config.on('beforeWatch', function() {
    for (const chunk in STYLES) {
      delete STYLES[chunk]
    }
  })
}
