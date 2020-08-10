const path = require('path')
const alias = require('module-alias')

// Set up alias for Twelvety options
alias.addAlias('@12ty', path.join(__dirname, '.twelvety'))

// You can now require Twelvety options like so
const twelvety = require('@12ty')

// Filters, transforms and shortcodes live in utils
const addFilters = require('./utils/filters')
const addTransforms = require('./utils/transforms')
const addShortcodes = require('./utils/shortcodes')

// Markdown options
const markdown = require('./utils/markdown')

module.exports = function (config) {
  addFilters(config)
  addTransforms(config)
  addShortcodes(config)

  // Deep merge when combining the Data Cascade
  // Documentation: https://www.11ty.dev/docs/data-deep-merge/
  config.setDataDeepMerge(true)

  // Options for LiquidJS
  // Documentation: https://liquidjs.com/tutorials/options.html
  config.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
    strict_variables: true
  })

  // Set instance of markdown-it so we can add our own plugin
  // Documentation: https://www.11ty.dev/docs/languages/markdown/#add-your-own-plugins
  config.setLibrary('md', markdown)

  return {
    dir: twelvety.dir
  }
}
