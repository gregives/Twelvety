const { JSDOM } = require('jsdom')

module.exports = async function(content, outputPath) {
  if (outputPath.endsWith('.html')) {
    const dom = new JSDOM(content)
    const { document } = dom.window

    // Get all elements to append
    const elements = [...document.querySelectorAll('[data-append]')]

    // Append each element to the given selector
    elements.forEach((element) => {
      const selector = element.dataset.append
      document.querySelector(selector).appendChild(element)

      // Replace template with its content
      element.replaceWith(...element.content.childNodes)
    })

    // Return serialized JSDOM
    return dom.serialize()
  }

  return content
}
