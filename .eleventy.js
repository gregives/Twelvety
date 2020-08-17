const path = require('path')
const alias = require('module-alias')

// Twelvety options can be found in .twelvety.js
// Set up alias for Twelvety options
alias.addAlias('@12ty', path.join(__dirname, '.twelvety'))

// You can now require Twelvety options using @12ty
const twelvety = require('@12ty')

// Filters, transforms and shortcodes can be found in utils
const addFilters = require('./utils/filters')
const addTransforms = require('./utils/transforms')
const addShortcodes = require('./utils/shortcodes')

// Instance of markdown-it
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
