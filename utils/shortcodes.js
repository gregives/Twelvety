const addStylesheetShortcodes = require('./shortcodes/stylesheet')
const addJavascriptShortcodes = require('./shortcodes/javascript')
const pictureShortcode = require('./shortcodes/picture')
const assetShortcode = require('./shortcodes/asset')

module.exports = function(config) {
  addStylesheetShortcodes(config)
  addJavascriptShortcodes(config)

  config.addShortcode('picture', pictureShortcode)
  config.addShortcode('asset', assetShortcode)

  // Add shortcodes here
}
