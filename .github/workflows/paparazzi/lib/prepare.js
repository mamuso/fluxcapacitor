"use strict";
/**
 * Prepare files for the final step
 */

const fs = require("fs");
const utils = require("./utils");

module.exports = async ({ ...options } = {}) => {
  utils.logHeader(`📦 Prepare files`);

  const currentPath = `${options.basePath}/reports/current.json`;
  const destinationPath = `${options.basePath}/reports/reports/${options.date}`;
  if (!fs.existsSync(destinationPath)) {
    await fs.promises.mkdir(destinationPath);
  }

  /**
   * Redefining current
   */
  if (fs.existsSync(currentPath)) {
    await fs.promises.unlink(currentPath);
  }
  await fs.promises.copyFile(
    `${options.destinationPath}/../current.json`,
    currentPath
  );

  /**
   * Moving report
   */
  // if (fs.existsSync(currentPath)) {
  //   await fs.promises.unlink(currentPath);
  // }
  // await fs.promises.copyFile(
  //   `${options.destinationPath}/../current.json`,
  //   currentPath
  // );
};
