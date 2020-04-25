import {Config} from './types'
import * as fs from 'fs'
import * as pngjs from 'pngjs'
import Pixelmatch from 'pixelmatch'

export default class Compare {
  config
  png

  constructor(config: Config) {
    this.config = {...config} as Config
    this.png = pngjs.PNG
  }

  /**
   * Compress folder.
   */
  compare = async (
    capturepath: string,
    currentpath: string,
    diffpath: string
  ) => {
    try {
      if (!fs.existsSync(currentpath)) {
        return -1
      }
      const captureimgraw = this.png.sync.read(fs.readFileSync(capturepath))
      const currentimgraw = this.png.sync.read(fs.readFileSync(currentpath))

      const hasSizeMismatch =
        currentimgraw.height !== captureimgraw.height ||
        currentimgraw.width !== captureimgraw.width

      const [captureimg, currentimg] = (await hasSizeMismatch)
        ? await this.alignImagesToSameSize(currentimgraw, captureimgraw)
        : [currentimgraw, captureimgraw]
      const imageWidth = captureimg.width
      const imageHeight = captureimg.height
      const diffImage = new this.png({
        width: imageWidth,
        height: imageHeight
      })

      const diffPixelCount = await Pixelmatch(
        captureimg.data,
        currentimg.data,
        diffImage.data,
        imageWidth,
        imageHeight,
        {
          threshold: 0.1,
          diffColor: [235, 76, 137]
        }
      )

      await fs.writeFileSync(diffpath, this.png.sync.write(diffImage))
      return diffPixelCount
    } catch (e) {
      throw e
    }
  }

  alignImagesToSameSize = async (firstImage, secondImage) => {
    // Keep original sizes to fill extended area later
    const firstImageWidth = firstImage.width
    const firstImageHeight = firstImage.height
    const secondImageWidth = secondImage.width
    const secondImageHeight = secondImage.height

    // Calculate biggest common values
    const resizeToSameSize = this.createImageResizer(
      Math.max(firstImageWidth, secondImageWidth),
      Math.max(firstImageHeight, secondImageHeight)
    )

    // Resize both images
    const resizedFirst = await resizeToSameSize(firstImage)
    const resizedSecond = await resizeToSameSize(secondImage)

    // Fill resized area with black transparent pixels
    return [
      this.fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
      this.fillSizeDifference(
        secondImageWidth,
        secondImageHeight
      )(resizedSecond)
    ]
  }

  createImageResizer = (width, height) => source => {
    const resized = new this.png({width, height, fill: true})
    this.png.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0)
    return resized
  }

  fillSizeDifference = (width, height) => image => {
    const inArea = (x, y) => y > height || x > width
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        if (inArea(x, y)) {
          const idx = (image.width * y + x) << 2
          image.data[idx] = 0
          image.data[idx + 1] = 0
          image.data[idx + 2] = 0
          image.data[idx + 3] = 64
        }
      }
    }
    return image
  }
}
