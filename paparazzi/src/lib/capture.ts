/**
 * Capture a list of urls with puppeteer.
 */

import { Config } from './types';

export default class Capture {
  config;
  constructor(config: Config) {
    this.config = { ...config } as Config;
  }

  capture = async () => {};
  close = async () => {};
}
