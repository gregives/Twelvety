const cleancss = require('clean-css')
const uglify = require('uglify-js')
const htmlmin = require('html-minifier')
const beautify = require('js-beautify')

// Use beautify in development
// Options: https://github.com/beautify-web/js-beautify
const BEAUTIFY_OPTIONS = {
  extra_liners: [],
  indent_inner_html: true,
  indent_size: 2,
  max_preserve_newlines: 1
}

function minifyCSS(options, content, type) {
  // Ignore inline and media types
  if (['media', 'inline'].includes(type))
    return content

  if (options.env === 'production') {
    // clean-css
    // Options: https://github.com/jakubpawlowicz/clean-css
    return new cleancss({
      specialComments: false
    }).minify(content).styles
  } else {
    return beautify.css(content, BEAUTIFY_OPTIONS)
  }
}

function minifyJS(options, content) {
  if (options.env === 'production') {
    // uglify
    // Options: https://github.com/mishoo/UglifyJS
    return uglify.minify(content).code
  } else {
    return beautify.js(content, BEAUTIFY_OPTIONS)
  }
}

function minifyHTML(options, content) {
  if (options.env === 'production') {
    // html-minifier
    // Options: https://github.com/kangax/html-minifier
    return htmlmin.minify(content, {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: minifyCSS.bind(null, options),
      minifyJS: minifyJS.bind(null, options),
      removeComments: true,
      useShortDoctype: true
    })
  } else {
    return beautify.html(content, BEAUTIFY_OPTIONS)
  }
}

module.exports = {
  css: minifyCSS,
  js: minifyJS,
  html: minifyHTML
}
