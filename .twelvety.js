// Twelvety options can be required using @12ty
// See .eleventy.js for more information
module.exports = {
  // Directory structure
  dir: {
    // ⬇ Eleventy uses these
    input: 'src',
    output: 'dist',
    includes: '_includes',
    layouts: '_layouts',
    data: '_data',
    // ⬇ Eleventy doesn't use these but Twelvety does
    assets: '_assets',
    styles: '_assets/styles',
    images: '_assets/images'
  },
  // Eleventy environment
  // Production or development set in package.json scripts
  env: process.env.ELEVENTY_ENV,
  // Enable Sass's indented syntax
  // Documentation: https://sass-lang.com/documentation/syntax#the-indented-syntax
  indentedSass: false,
  // Image formats and quality to generate
  // Pass `same` to generate responsive images in the input format
  // Documentation: https://sharp.pixelplumbing.com/api-output
  imageFormats: {
    same: 75,
    webp: 60,
    // Remove AVIF if builds are taking too long
    avif: 30
  }
}
