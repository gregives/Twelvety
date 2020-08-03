const addStylesheetShortcodes = require('./shortcodes/stylesheet')
const addJavascriptShortcodes = require('./shortcodes/javascript')

module.exports = function(config, options) {
  addStylesheetShortcodes(config, options)
  addJavascriptShortcodes(config, options)

  // Add shortcodes
}
