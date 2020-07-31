const addStylesheetShortcodes = require('./shortcodes/stylesheet')
const addJavascriptShortcodes = require('./shortcodes/javascript')

module.exports = function(config) {
  addStylesheetShortcodes(config)
  addJavascriptShortcodes(config)

  // Add shortcodes
}
