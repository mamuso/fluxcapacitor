'use strict';

import { Paparazzi } from './dist/paparazzi.js';

const paparazzi = new Paparazzi(
  process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0]
);

// Switch logic
switch (process.argv[2]) {
  case 'setup': {
    paparazzi.setup();
    break;
  }
  case 'capture': {
    paparazzi.capture();
    break;
  }
  default: {
    break;
  }
}
