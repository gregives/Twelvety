const path = require('path')
const sass = require('node-sass')
const postcss = require('postcss')
const postcssPresetEnv = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')

module.exports = {
  addShortcodes(config) {
    const STYLES = {}

    // Store component stylesheets
    config.addPairedShortcode('stylesheet', function(content, _language, chunk = this.page.url) {
      if (!STYLES.hasOwnProperty(chunk))
        STYLES[chunk] = []

      if (!STYLES[chunk].includes(content))
        STYLES[chunk].push(content)
    })

    // Render component stylesheets
    config.addShortcode('styles', async function(chunk = this.page.url) {
      const css = STYLES[chunk]
        .map((data) => {
          return sass
            .renderSync({
              data,
              includePaths: [
                path.resolve(process.cwd(), 'src', '_assets', 'styles')
              ]
            })
            .css
            .toString()
        })
        .join('\n')

      const post = await postcss([postcssPresetEnv, autoprefixer]).process(css)
      return `<style>${post}</style>`
    })

    config.on('beforeWatch', function() {
      for (const chunk in STYLES) {
        delete STYLES[chunk]
      }
    })
  }
}
