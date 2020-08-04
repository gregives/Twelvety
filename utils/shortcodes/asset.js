const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

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

module.exports = function(options, content, extension) {
  const hash = hashContent(content)

  // Output assets directory
  const assetsDir = path.join(process.cwd(), options.dir.output, options.dir.assets)

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
  return path.posix.join('/', options.dir.assets, filename)
}

module.exports.hashContent = hashContent
