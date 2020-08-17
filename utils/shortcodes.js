const addStylesheetShortcodes = require('./shortcodes/stylesheet')
const addJavascriptShortcodes = require('./shortcodes/javascript')
const pictureShortcode = require('./shortcodes/picture')
const assetShortcode = require('./shortcodes/asset')

// Instance of markdown-it
const markdown = require('./markdown')

module.exports = function(config) {
  addStylesheetShortcodes(config)
  addJavascriptShortcodes(config)

  config.addShortcode('picture', pictureShortcode)
  config.addShortcode('asset', assetShortcode)

  // Helper for the append transform
  config.addPairedShortcode('append', function(content, selector) {
    return `<template data-append="${selector}">\n${content}\n</template>`
  })

  // Markdown paired shortcode, useful for including Markdown files
  config.addPairedShortcode('markdown', function(content) {
    return markdown.render(content)
  })

  // Add shortcodes here
}
