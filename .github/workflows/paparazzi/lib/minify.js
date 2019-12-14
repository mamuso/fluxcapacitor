"use strict";
/**
 * Minify a collection of screenshots with imagemin
 */

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const utils = require("./utils");

module.exports = async ({ ...config } = {}) => {
  utils.logHeader(`📦 Minify captures`);

  const files = await imagemin(
    [`${config.tmpDatepath}/${config.pattern || "*"}.{jpg,png}`],
    {
      destination: config.tmpDatepath,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    }
  );
  console.log(`${files.length} files processed`);
};
