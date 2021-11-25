/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env';
import Printer from './lib/utils';

class Paparazzi {
  printer;

  constructor(date: string) {
    this.printer = new Printer();
  }

  setup = async () => {};
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
