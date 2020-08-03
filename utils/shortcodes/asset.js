const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function(options, content, extension) {
  // Create hash of the content
  const hash = crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .slice(0, 8)

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
