/* eslint-disable no-console */

/**
 * Capture a list of urls with puppeteer.
 */

import { Config } from './types';
// import Printer from './utils';

export default class Capture {
  config;
  constructor(config: Config) {
    this.config = { ...config } as Config;
  }

  capture = async () => {
    console.log('capture');
  };
  close = async () => {
    console.log('close');
  };
}
