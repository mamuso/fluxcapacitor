/**
 * Screenshot and store all the things.
 */

import * as fs from 'fs';
import { Config, Device, Endpoint } from './types';
import Printer from './utils';
import puppeteer from 'puppeteer';
import slugify from '@sindresorhus/slugify';

export default class Capture {
  browser;
  config;
  printer;

  constructor(config: Config) {
    this.printer = new Printer();
    this.config = { ...config } as Config;
  }

  /**
   *  Logic to capture the list of endpoints.
   */
  capture = async () => {
    try {
      this.printer.header(`📷 Capture URLs`);

      // Create a new browser instance
      this.browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });

      // Loop through devices
      for (const deviceConfig of this.config.devices) {
        const device = await this.setDevice(deviceConfig);

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
          await this.takeScreenshot(endpoint, device);
        }
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   *  Take a screenshot and save it.
   */
  takeScreenshot = async (endpoint: Endpoint, device: Device) => {
    const filename = `${slugify(endpoint.id)}.${this.config.format}`;
    // const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
    // const capture = {} as CaptureType;

    this.printer.capture(`${endpoint.id} – ${filename} – ${device.id}`);
  };

  /**
   *  Configure device for capture.
   */
  setDevice = async (deviceConfig: Device) => {
    const device = (
      deviceConfig.device
        ? puppeteer.devices[deviceConfig.device]
        : deviceConfig
    ) as Device;

    device.userAgent = device.userAgent || (await this.browser.userAgent());
    device.id = deviceConfig.id;
    device.deviceScaleFactor = device.viewport.deviceScaleFactor;

    return device;
  };

  /**
   *  Close sessions.
   */
  close = async () => {
    /** Close browser session */
    if (this.browser) {
      await this.browser.close();
    }
  };
}
