"use strict";
/**
 * Minify a collection of screenshots with imagemin
 */

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
