const addFilters = require('./utils/filters')
const addTransforms = require('./utils/transforms')
const addShortcodes = require('./utils/shortcodes')

const options = {
  // Directory structure
  dir: {
    input: 'src',
    output: 'dist',
    includes: '_includes',
    layouts: '_layouts',
    data: '_data',
    // ⬇ Not used by Eleventy, just Twelvety!
    assets: '_assets',
    styles: '_assets/styles',
    images: '_assets/images'
  },
  // Eleventy environment
  env: process.env.ELEVENTY_ENV
}

module.exports = function (config) {
  addFilters(config, options)
  addTransforms(config, options)
  addShortcodes(config, options)

  // Deep merge when combining the Data Cascade
  // Documentation: https://www.11ty.dev/docs/data-deep-merge/
  config.setDataDeepMerge(true)

  return {
    dir: options.dir
  }
}
