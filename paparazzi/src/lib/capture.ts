/* eslint-disable no-console */

/**
 * Screenshot and store all the things.
 */

import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import { CaptureType, Config, Device, Endpoint } from './types';
import { Printer, slugify } from './utils';

export default class Capture {
  public config: Config;
  private printer: Printer;

  constructor(config: Config) {
    this.printer = new Printer();
    this.config = { ...config };
  }

  /**
   *  Logic to capture the list of endpoints.
   */
  capture = async (): Promise<void> => {
    try {
      this.printer.header(`📷 Capture URLs`);

      // Loop through devices
      for (const deviceConfig of this.config.devices) {
        // Create a new browser instance

        const browser = await puppeteer.launch({
          headless: true,
          defaultViewport: null,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });

        const device = await this.setDevice(deviceConfig, browser);

        this.printer.subHeader(
          `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
        );

        // Create device folder
        if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
          await fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
        }

        // Loop through endpoints
        for (const endpointObject of this.config.endpoints) {
          const endpoint: Endpoint = endpointObject;
          await this.takeScreenshot(endpoint, device, browser);
        }

        // Close puppeteer browser instance
        await browser.close();
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   * Take a screenshot and save it.
   *
   * @param endpoint - URL to capture
   * @param device - Device configuration object
   * @param browser - Puppeteer browser instance
   * @returns Promise
   *
   */
  takeScreenshot = async (
    endpoint: Endpoint,
    device: Device,
    browser: puppeteer.Browser
  ): Promise<void> => {
    const filename = `${slugify(endpoint.id)}.${this.config.format}`;
    const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;

    this.printer.capture(`${endpoint.id} – ${filename} – ${device.id}`);

    // Set up the device emulation
    const puppet = await browser.newPage();
    await puppet.emulate(device);

    // TODO: Add auth

    await puppet.goto(endpoint.url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Speed up animations
    const client = await puppet.target().createCDPSession();
    await client.send('Animation.setPlaybackRate', {
      playbackRate: 2,
    });

    // Check scroll height
    /* istanbul ignore next */
    const scrollHeight = await puppet.evaluate((_): number => {
      return document.body.scrollHeight;
    });

    // Let's wait before the first shot
    await puppet.waitForTimeout(400);

    const test = {} as CaptureType;
    console.log(test);
    console.log(scrollHeight);
    console.log(localfilepath);
  };

  /**
   *  Configure device for capture.
   *
   * @param device - Device configuration object
   * @param browser - Puppeteer browser instance
   * @returns Puppeteer device instance
   *
   */
  setDevice = async (
    deviceConfig: Device,
    browser: puppeteer.Browser
  ): Promise<Device> => {
    const device = (
      deviceConfig.device
        ? puppeteer.devices[deviceConfig.device]
        : deviceConfig
    ) as Device;

    device.userAgent = device.userAgent || (await browser.userAgent());
    device.id = deviceConfig.id;
    device.deviceScaleFactor = device.viewport.deviceScaleFactor;

    return device;
  };
}
