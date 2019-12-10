"use strict";
/**
 * Capture a list of urls with puppeteer
 */

const puppeteer = require("puppeteer");
const slugify = require("slugify");
const utils = require("./utils");

const screens = [];

module.exports = async ({ ...options } = {}) => {
  utils.logHeader(`📷 Capture URLs`);

  /**
   * Looping through devices
   */
  let i = 0;
  const iMax = options.devices.length;
  for (; i < iMax; i++) {
    const captureDevice = options.devices[i];
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    let device = captureDevice.device
      ? puppeteer.devices[captureDevice.device]
      : captureDevice;
    device.userAgent = device.userAgent || (await browser.userAgent());
    await page.emulate(device);

    utils.logSubheader(
      `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
    );

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
      const localFilePath = `${options.path}/${fileName}`;
      await page.goto(captureData.url);
      await page.screenshot({
        path: localFilePath,
        fullPage: captureData.fullPage
      });

      await screens.push({
        id: `${captureDevice.id}-${slugify(captureData.id)}`,
        screenId: captureData.id,
        screenName: fileName,
        screenPath: localFilePath,
        diff: false
      });

      utils.logCaptureURL(captureData.id);
    }
    await browser.close();
  }
  return screens;
};
