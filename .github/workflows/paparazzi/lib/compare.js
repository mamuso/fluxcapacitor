"use strict";
/**
 * Compare a collection of screenshots with pixelmatch
 */

const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const slugify = require("slugify");
const utils = require("./utils");

let diff = [];

/**
 * Functions to help compare same size images
 * https://github.com/mapbox/pixelmatch/issues/23
 */
const createImageResizer = (width, height) => source => {
  const resized = new PNG({ width, height, fill: true });
  PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
  return resized;
};

const fillSizeDifference = (width, height) => image => {
  const inArea = (x, y) => y > height || x > width;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (inArea(x, y)) {
        const idx = (image.width * y + x) << 2;
        image.data[idx] = 0;
        image.data[idx + 1] = 0;
        image.data[idx + 2] = 0;
        image.data[idx + 3] = 64;
      }
    }
  }
  return image;
};

const alignImagesToSameSize = (firstImage, secondImage) => {
  // Keep original sizes to fill extended area later
  const firstImageWidth = firstImage.width;
  const firstImageHeight = firstImage.height;
  const secondImageWidth = secondImage.width;
  const secondImageHeight = secondImage.height;

  // Calculate biggest common values
  const resizeToSameSize = createImageResizer(
    Math.max(firstImageWidth, secondImageWidth),
    Math.max(firstImageHeight, secondImageHeight)
  );

  // Resize both images
  const resizedFirst = resizeToSameSize(firstImage);
  const resizedSecond = resizeToSameSize(secondImage);

  // Fill resized area with black transparent pixels
  return [
    fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
    fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
  ];
};

module.exports = async ({ ...options } = {}) => {
  utils.logHeader(`🔍 Comparing screens`);

  /**
   * Looping through devices
   */
  let i = 0;
  const iMax = options.devices.length;
  for (; i < iMax; i++) {
    const captureDevice = options.devices[i];

    /**
     * Looping through URLs
     */
    let j = 0;
    const jMax = options.urls.length;
    for (; j < jMax; j++) {
      const captureData = options.urls[j];
      const fileName = `${captureDevice.id}-${slugify(captureData.id)}.${
        options.format
      }`;
      const fileDiffName = `${captureDevice.id}-${slugify(
        captureData.id
      )}-diff.${options.format}`;

      try {
        const rawReceivedImage = PNG.sync.read(
          fs.readFileSync(`${options.path}/${fileName}`)
        );
        const rawBaselineImage = PNG.sync.read(
          fs.readFileSync(`${options.current}/${fileName}`)
        );

        const hasSizeMismatch =
          rawReceivedImage.height !== rawBaselineImage.height ||
          rawReceivedImage.width !== rawBaselineImage.width;

        // Align images in size if different
        const [receivedImage, baselineImage] = hasSizeMismatch
          ? alignImagesToSameSize(rawReceivedImage, rawBaselineImage)
          : [rawReceivedImage, rawBaselineImage];
        const imageWidth = receivedImage.width;
        const imageHeight = receivedImage.height;
        const diffImage = new PNG({ width: imageWidth, height: imageHeight });

        const diffPixelCount = pixelmatch(
          receivedImage.data,
          baselineImage.data,
          diffImage.data,
          imageWidth,
          imageHeight,
          {
            threshold: 0.1,
            diffColor: [247, 35, 34]
          }
        );

        const totalPixels = imageWidth * imageHeight;
        const diffRatio = diffPixelCount / totalPixels;

        if (diffRatio > 0) {
          utils.logCompareURL(
            `${captureDevice.id}-${slugify(
              captureData.id
            )} changed - ${diffRatio}`
          );
          diff.push({ id: `${captureDevice.id}-${slugify(captureData.id)}` });
        }

        fs.writeFileSync(
          `${options.path}/${fileDiffName}`,
          PNG.sync.write(diffImage)
        );
      } catch (e) {
        utils.logCompareURL(
          `${captureDevice.id}-${slugify(captureData.id)} seems to be new!`
        );
        diff.push({ id: `${captureDevice.id}-${slugify(captureData.id)}` });
      }
    }
  }
  return diff;
};
