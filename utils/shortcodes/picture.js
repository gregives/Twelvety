const path = require('path')
const sharp = require('sharp')
const jsonfile = require('jsonfile')

// Asset shortcode for saving hashed assets
const saveAsset = require('./asset'), { hashContent } = saveAsset

// Sizes for responsive image in intervals of 160 i.e. 160, 320, ..., 1920
const SIZES = Array.from(new Array(12), (_, index) => (index + 1) * 160)
// File to save responsive image cache
const CACHE_FILE = path.join(process.cwd(), '.twelvety.cache')
// Quality of outputted images
const QUALITY = 75

// Load cache from file or create new cache
function loadCache() {
  try {
    return jsonfile.readFileSync(CACHE_FILE)
  } catch {
    return {}
  }
}

// Save image as the given format
async function saveImageFormat(options, image, format) {
  // Format image and reduce quality
  const formatted = image.clone().toFormat(format)[format]({
    quality: QUALITY
  })

  // Save buffer of formatted image
  const buffer = await formatted.toBuffer()
  return saveAsset(options, buffer, format)
}

// Get the average color from an image
async function getAverageColor(image) {
  // Resize to one pixel and get raw buffer
  const buffer = await image.clone().resize(1).raw().toBuffer()
  // Convert values to percentages
  const values = [...buffer].map((value) => `${(value * 100 / 255).toFixed(0)}%`)
  // Output rgb or rgba color
  return `${values.length < 4 ? 'rgb' : 'rgba'}(${values.join(',')})`
}

module.exports = async function(options, src, alt, sizes = '90vw', loading = 'lazy') {
  if (alt === undefined)
    throw new Error('Images should always have an alt tag')

  // TODO: Where should the source path resolve from?
  const imagePath = path.join(process.cwd(), src)

  // Original image in sharp
  const original = sharp(imagePath)

  // Hash the original image
  const imageHash = hashContent(await original.toBuffer())

  // If image is in cache, return cache
  const cache = loadCache()
  if (cache.hasOwnProperty(imageHash)) {
    return cache[imageHash]
  }

  // Get metadata from original image
  const { format, height, width } = await original.metadata()

  // Average color used for background while image loads
  const color = await getAverageColor(original)

  // Resize image for responsive-ness
  const images = SIZES.map((width) => {
    return original.clone().resize(width)
  })

  // Save responsive images in same format
  const sameFormat = await Promise.all(images.map(async (image, index) => {
    const filename = await saveImageFormat(options, image, format)
    return `${filename} ${SIZES[index]}w`
  }))

  // Save responsive images in webp format
  const webpFormat = await Promise.all(images.map(async (image, index) => {
    const filename = await saveImageFormat(options, image, 'webp')
    return `${filename} ${SIZES[index]}w`
  }))

  // Fallback image
  const fallback = sameFormat[sameFormat.length - 1].split(' ')[0]

  // Aspect ratio for padding-bottom
  const ratio = (height / width * 100).toFixed(3)

  // Responsive picture with srcset and native lazy loading
  const picture = `
    <picture style="background-color:${color};padding-bottom:${ratio}%">
      <source srcset="${webpFormat.join(',')}" sizes="${sizes}" type="image/webp">
      <source srcset="${sameFormat.join(',')}" sizes="${sizes}" type="image/${format}">
      <img src="${fallback}" alt="${alt}" loading="${loading}">
    </picture>
  `

  // Add picture to cache
  cache[imageHash] = picture
  jsonfile.writeFileSync(CACHE_FILE, cache)

  return picture
}
