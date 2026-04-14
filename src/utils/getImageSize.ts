import { readFileSync } from 'node:fs'
import { imageSize } from 'image-size'

type ImageSize = number | null

type ImageMeta = {
  width: ImageSize
  height: ImageSize
}

const cache: Record<string, ImageMeta> = {}

export const getImageSize = (imagePath: string): ImageMeta => {
  // Check if the image is already in the cache
  if (cache[imagePath]) {
    return cache[imagePath]
  }

  try {
    const buffer = readFileSync(imagePath)
    const dimensions = imageSize(new Uint8Array(buffer))

    // invalid dimensions
    if (!dimensions?.width || !dimensions.height) {
      console.error('Invalid image dimensions')
      return { width: null, height: null }
    }

    const result: ImageMeta = {
      width: dimensions.width,
      height: dimensions.height
    }

    cache[imagePath] = result
    return result
  } catch (err) {
    console.error(err)
    return { width: null, height: null }
  }
}
