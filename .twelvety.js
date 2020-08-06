module.exports = {
  // Directory structure
  dir: {
    input: 'src',
    output: 'dist',
    includes: '_includes',
    layouts: '_layouts',
    data: '_data',
    // ⬇ Not used by Eleventy, just Twelvety
    assets: '_assets',
    styles: '_assets/styles',
    images: '_assets/images'
  },
  // Eleventy environment
  env: process.env.ELEVENTY_ENV
}
