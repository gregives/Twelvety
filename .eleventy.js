const filters = require('./utils/filters')
const transforms = require('./utils/transforms')
const shortcodes = require('./utils/shortcodes')

module.exports = function (config) {
  // Add all filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName])
  })

  // Add all transforms
  Object.keys(transforms).forEach((transformName) => {
    config.addTransform(transformName, transforms[transformName])
  })

  // Add all shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addPairedShortcode(shortcodeName, shortcodes[shortcodeName])
  })

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
