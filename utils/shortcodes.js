const addStylesheetShortcodes = require('./shortcodes/stylesheet')
const addJavascriptShortcodes = require('./shortcodes/javascript')
const assetShortcode = require('./shortcodes/asset')
const pictureShortcode = require('./shortcodes/picture')

module.exports = function(config, options) {
  addStylesheetShortcodes(config, options)
  addJavascriptShortcodes(config, options)

  // Bind options to the first argument of asset shortcode function
  config.addShortcode('asset', assetShortcode.bind(null, options))

  // Bind options to the first argument of picture shortcode function
  config.addShortcode('picture', pictureShortcode.bind(null, options))

  // Add shortcodes
}
