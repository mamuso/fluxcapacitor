/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env';
import { Config } from './lib/types';
import Printer from './lib/utils';

class Paparazzi {
  date;
  config;
  printer;

  constructor(date: string) {
    this.printer = new Printer();
    this.config = {
      date: this.date,
    } as Config;
  }

  // Run all the tasks needed to kick off the process.
  setup = async () => {
    try {
      this.createScaffold();
      this.printer.header(`✨ Setting up the folder structure - ${this.date}`);
    } catch (e) {
      throw e;
    }
  };

  /**
   *  Create the folder structure needed for capturing the screens
   */
  createScaffold = async () => {};
}

const paparazzi = new Paparazzi(
  process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0] // date
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
