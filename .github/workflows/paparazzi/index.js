// Capture the screens
const puppeteer = require('puppeteer');

// Compare the screens
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const core = require("@actions/core");
const github = require("@actions/github");

const config = require("../../../timesled-config");

const githubtoken = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(githubtoken);
const context = github.context;
const date = new Date().toISOString().split("T")[0];


const createImageResizer = (width, height) => (source) => {
  const resized = new PNG({ width, height, fill: true });
  PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
  return resized;
};

const fillSizeDifference = (width, height) => (image) => {
  const inArea = (x, y) => y > height || x > width;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (inArea(x, y)) {
        const idx = ((image.width * y) + x) << 2;
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
    fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond),
  ];
};



const rawReceivedImage = PNG.sync.read(fs.readFileSync('screens/desktop-github.png'));
const rawBaselineImage = PNG.sync.read(fs.readFileSync('screenscopy/tablet-github.png'));
const hasSizeMismatch = (
  rawReceivedImage.height !== rawBaselineImage.height ||
  rawReceivedImage.width !== rawBaselineImage.width
);
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
  0.1
);

const totalPixels = imageWidth * imageHeight;
const diffRatio = diffPixelCount / totalPixels;

fs.writeFileSync('screens/diff.png', PNG.sync.write(diffImage));


(async () => {

  // Loop devices
  for (let i = 0; i < config.devices.length; i++) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Emulate device
    let device = config.devices[i].device ? puppeteer.devices[config.devices[i].device] : config.devices[i];
    device.userAgent = device.userAgent || await browser.userAgent();
    await console.log(device.userAgent);
    await page.emulate(device);

    await page.goto('https://github.com');
    await page.screenshot({path: `screens/${config.devices[i].id}-github.png`, fullPage: true});
    await browser.close();
  }
})();
