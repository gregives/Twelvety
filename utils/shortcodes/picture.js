const path = require('path')
const sharp = require('sharp')
const deasync = require('deasync')
const jsonfile = require('jsonfile')

// Twelvety options from .twelvety.js
const twelvety = require('@12ty')

// Image formats for picture
const formats = twelvety.imageFormats

// Asset shortcode for saving hashed assets
const saveAsset = require('./asset'), { hashContent } = saveAsset

// Sizes for responsive image in intervals of 160 i.e. 160, 320, ..., 1920
const SIZES = Array.from(new Array(12), (_, index) => (index + 1) * 160)

// File to save responsive image cache
const CACHE_FILE = path.join(process.cwd(), '.twelvety.cache')

// Function to deasync sharp functions
// This is required for synchronous markdown-it plugin
function deasyncSharp(image, sharpFunction) {
  let result

  // Call function with callback
  image[sharpFunction].bind(image)((error, data) => {
    if (error) throw error
    result = data
  })

  // Loop while the result is undefined
  deasync.loopWhile(() => result === undefined)
  return result
}

// Get image path from src
function getImagePath(src) {
  const index = src.indexOf(twelvety.dir.images)
  const position = index >= 0 ? index + twelvety.dir.images.length : 0
  const imageFilename = src.substring(position)
  return path.join(process.cwd(), twelvety.dir.input, twelvety.dir.images, imageFilename)
}

// Load cache from file or create new cache
function loadCache() {
  try {
    return jsonfile.readFileSync(CACHE_FILE)
  } catch {
    return {}
  }
}

// Save image as the given size and format
function saveImageFormat(image, width, format, quality) {
  // Resize image and format with given quality
  const formatted = image.clone().resize(width)[format]({
    quality
  })

  // Save buffer of formatted image
  const buffer = deasyncSharp(formatted, 'toBuffer')
  return saveAsset(buffer, format)
}

// Get the average color from an image
function getAverageColor(image) {
  // Resize to one pixel and get raw buffer
  const buffer = deasyncSharp(image.clone().resize(1).raw(), 'toBuffer')
  // Convert values to percentages
  const values = [...buffer].map((value) => `${(value * 100 / 255).toFixed(0)}%`)
  // Output rgb or rgba color
  return `${values.length < 4 ? 'rgb' : 'rgba'}(${values.join(',')})`
}

module.exports = function(src, alt, sizes = '90vw, (min-width: 1280px) 1152px', loading = 'lazy') {
  if (alt === undefined)
    throw new Error('Images should always have an alt tag')

  const imagePath = getImagePath(src)

  // Original image in sharp
  const original = sharp(imagePath)

  // Hash the original image
  const imageHash = hashContent(deasyncSharp(original, 'toBuffer'))

  // Load cache of resized images
  const cache = loadCache()
  const cachePicture = cache.hasOwnProperty(imageHash) && cache[imageHash]

  // Get metadata from original image
  const { format: inputFormat, height, width } = deasyncSharp(original, 'metadata')

  // Average color used for background while image loads
  const color = getAverageColor(original)

  // Generate images for all formats and widths
  const images = Object.entries(formats).reduce((images, [format, quality]) => {
    // If format is `same` then use the same format as the input
    format = format === 'same' ? inputFormat : format

    images[format] = SIZES.reduce((formatImages, width) => {
      // Use the cached image or save a new image
      formatImages[width] = (cachePicture && cachePicture[format] && cachePicture[format][width]) ||
        saveImageFormat(original, width, format, quality)
      return formatImages
    }, {})

    return images
  }, {})

  // Create descriptors for picture srcsets
  const descriptors = Object.entries(images).reduce((descriptors, [format, images]) => {
    descriptors[format] = Object.entries(images).map(([width, image]) => `${image} ${width}w`).join(',')
    return descriptors
  }, {})

  // Use input format as fallback format if possible
  const fallbackFormat = formats.hasOwnProperty('same') ? inputFormat : Object.keys(formats)[0]
  const fallback = images[fallbackFormat][SIZES[SIZES.length - 1]]

  // Aspect ratio for padding-bottom
  const ratio = Math.round(height * 100000 / width) / 1000

  // Render srcsets for picture
  const srcsets = Object.entries(descriptors).map(([format, descriptor]) => {
    return `<source srcset="${descriptor}" sizes="${sizes}" type="image/${format}">`
  }).join('\n      ')

  // Responsive picture with srcset and native lazy loading
  const picture = `
    <picture style="background-color:${color};padding-bottom:${ratio}%">
      ${srcsets}
      <img src="${fallback}" alt="${alt}" loading="${loading}">
    </picture>
  `

  // Add images to cache
  cache[imageHash] = images

  // Save cache file
  jsonfile.writeFileSync(CACHE_FILE, cache, { spaces: 2 })

  return picture
}
