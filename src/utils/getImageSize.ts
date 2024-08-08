import sizeOf from 'image-size'

type ImageSize = number | null

type ImageMeta = {
  width: ImageSize
  height: ImageSize
}

const cache: Record<string, ImageMeta> = {}

export const getImageSize = (imagePath: string): Promise<ImageMeta> => {
  return new Promise((resolve) => {
    // Check if the image is already in the cache
    if (cache[imagePath]) {
      return resolve(cache[imagePath])
    }

    sizeOf(imagePath, (err, dimensions) => {
      // error handling
      if (err) {
        console.error(err)
        return resolve({
          width: null,
          height: null
        })
      }

      // invalid dimensions
      if (!dimensions || !dimensions.width || !dimensions.height) {
        console.error('Invalid image dimensions')
        return resolve({
          width: null,
          height: null
        })
      }

      // return the dimensions
      return resolve({
        width: dimensions.width,
        height: dimensions.height
      })
    })
  })
}
