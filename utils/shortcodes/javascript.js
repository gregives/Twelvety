const browserify = require('browserify')
const babel = require('@babel/core')
const babelPresetEnv = require('@babel/preset-env')

// Readable stream for browserify in-memory
const { Readable } = require('stream')

// Twelvety options from .twelvety.js
const twelvety = require('@12ty')

// Bundle scripts with browserify
// Documentation: https://github.com/browserify/browserify
function bundleScripts(data) {
  return new Promise((resolve, reject) => {
    // Pass browserify a ReadableStream of the script
    let temp = browserify([Readable.from(data)])

    // Plugin tinyify provides various optimisations
    if (twelvety.env === 'production')
      temp = temp.plugin('tinyify')

    // Bundle code for browser
    temp.bundle((error, buffer) => {
      if (error)
        reject(error)
      resolve(buffer)
    })
  })
}

module.exports = function(config) {
  // Each script is stored within an array for its given 'chunk'
  const SCRIPTS = {}

  // Store each script within its chunk
  // The chunk defaults to the URL of the current page
  config.addPairedShortcode('javascript', function(content, chunk = this.page.url) {
    // Make sure that the chunk exists
    if (!SCRIPTS.hasOwnProperty(chunk))
      SCRIPTS[chunk] = []

    // Add the script to the chunk, if it's not already in it
    if (!SCRIPTS[chunk].includes(content))
      SCRIPTS[chunk].push(content)

    return ''
  })

  // Render the scripts for the given chunk
  config.addShortcode('script', async function(chunk = this.page.url) {
    // If there aren't any scripts, just return nothing
    if (!SCRIPTS.hasOwnProperty(chunk))
      return ''

    // Wrap scripts in IIFE and join all the scripts in chunk
    const joined = SCRIPTS[chunk].map((data) => `;(() => {\n${data}\n})()`).join('\n')
    // Bundle the scripts using browserify
    const bundled = await bundleScripts(joined)
    // Use Babel with babel-preset-env for compatibility
    return babel.transformSync(bundled, { presets: [babelPresetEnv] }).code
  })

  // Reset all scripts on re-runs
  config.on('beforeWatch', function() {
    for (const chunk in SCRIPTS) {
      delete SCRIPTS[chunk]
    }
  })
}
