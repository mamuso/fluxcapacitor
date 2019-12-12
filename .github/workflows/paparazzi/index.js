"use strict";
/**
 * Paparazzi
 * A GitHub action to capture, compare, minify and store screenshots
 */

const fs = require("fs");
fs.readdir(".", function(err, items) {
  console.log(items);
});
