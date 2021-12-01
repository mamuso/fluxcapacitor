"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const paparazzi_1 = require("./paparazzi");
const paparazzi = new paparazzi_1.Paparazzi(process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0]);
switch (process.argv[2]) {
    case 'setup': {
        paparazzi.setup();
        break;
    }
    // case 'getcurrent': {
    //   paparazzi.getCurrent()
    //   break
    // }
    case 'capture': {
        paparazzi.capture();
        break;
    }
    // case 'resize': {
    //   paparazzi.resize()
    //   break
    // }
    // case 'compare': {
    //   paparazzi.compare()
    //   break
    // }
    // case 'setcurrent': {
    //   paparazzi.setCurrent()
    //   break
    // }
    // case 'sparklines': {
    //   paparazzi.sparklines()
    //   break
    // }
    default: {
        //statements;
        break;
    }
}
