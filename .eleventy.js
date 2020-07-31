const { addFilters } = require('./utils/filters')
const { addTransforms } = require('./utils/transforms')
const { addShortcodes } = require('./utils/shortcodes')

module.exports = function (config) {
  addFilters(config)
  addTransforms(config)
  addShortcodes(config)

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
