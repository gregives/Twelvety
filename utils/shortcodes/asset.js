const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Twelvety options from .twelvety.js
const twelvety = require('@12ty')

// Minify functions
const minify = require('../minify')

// Size of asset hash
const SIZE = 8

// Hash function
function hashContent(content) {
  return crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .slice(0, SIZE)
}

module.exports = function(content, extension) {
  // Minify content if applicable
  if (['css', 'js', 'html'].includes(extension))
    content = minify[extension](content)

  // Hash content
  const hash = hashContent(content)

  // Output assets directory
  const assetsDir = path.join(process.cwd(), twelvety.dir.output, twelvety.dir.assets)

  // Ensure the assets folder exists
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, {
      recursive: true
    })
  }

  // Save hashed asset file
  const filename = `${hash}.${extension}`
  fs.writeFileSync(path.join(assetsDir, filename), content)

  // Output root path from output directory
  return path.posix.join('/', twelvety.dir.assets, filename)
}

module.exports.hashContent = hashContent
