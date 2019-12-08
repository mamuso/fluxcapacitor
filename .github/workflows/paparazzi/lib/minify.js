"use strict";
/**
 * Minify a collection of screenshots with imagemin
 */

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const utils = require("./utils");

module.exports = async ({ ...options } = {}) => {
  utils.logHeader(`📦 Minify captures`);

  const files = await imagemin(
    [`${options.path}/${options.pattern || "*"}.{jpg,png}`],
    {
      destination: options.path,
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
