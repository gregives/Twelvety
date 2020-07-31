const babel = require('@babel/core')
const babelPresetEnv = require('@babel/preset-env')

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
  })

  // Render the scripts for the given chunk
  config.addShortcode('script', async function(chunk = this.page.url) {
    // Join all the scripts in the chunk
    const joined = SCRIPTS[chunk].join('\n')

    // Use Babel with babel-preset-env for compatability
    const scripts = babel.transformSync(joined, { presets: [babelPresetEnv] }).code

    // Return the scripts inline
    return `<script>${scripts}</script>`
  })

  // Reset all scripts on re-runs
  config.on('beforeWatch', function() {
    for (const chunk in SCRIPTS) {
      delete SCRIPTS[chunk]
    }
  })
}
