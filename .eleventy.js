const addFilters = require('./utils/filters')
const addTransforms = require('./utils/transforms')
const addShortcodes = require('./utils/shortcodes')

module.exports = function (config) {
  addFilters(config)
  addTransforms(config)
  addShortcodes(config)

  // Deep merge when combining the Data Cascade
  // Documentation: https://www.11ty.dev/docs/data-deep-merge/
  config.setDataDeepMerge(true)

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    }
  }
}
