/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env';
import { Config } from './lib/types';
import Printer from './lib/utils';
import * as fs from 'fs';

class Paparazzi {
  config;
  printer;

  constructor(date: string, tmpPath: string = 'tmp') {
    this.printer = new Printer();
    this.config = {
      date: date,
      tmpPath: tmpPath,
      tmpDatePath: `${tmpPath}/${date}`,
      tmpCurrentPath: `${tmpPath}/current`,
    } as Config;
  }

  // Run all the tasks needed to kick off the process.
  setup = async () => {
    try {
      this.createScaffold();
      this.printer.header(
        `✨ Setting up the folder structure - ${this.config.date}`
      );
    } catch (e) {
      throw e;
    }
  };

  /**
   *  Create the folder structure needed for capturing the screens
   */
  createScaffold = async () => {
    if (!fs.existsSync(this.config.tmpPath)) {
      await fs.promises.mkdir(this.config.tmpPath);
    }
    if (!fs.existsSync(this.config.tmpDatePath)) {
      await fs.promises.mkdir(this.config.tmpDatePath);
    }
    if (!fs.existsSync(this.config.tmpCurrentPath)) {
      await fs.promises.mkdir(this.config.tmpCurrentPath);
    }
  };
}

const paparazzi = new Paparazzi(
  process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0]
);

// Switch logic
switch (process.argv[2]) {
  case 'setup': {
    paparazzi.setup();
    break;
  }
  default: {
    break;
  }
}
