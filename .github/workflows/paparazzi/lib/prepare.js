"use strict";
/**
 * Prepare files for the final step
 */

const fs = require("fs");
const utils = require("./utils");

module.exports = async ({ ...options } = {}) => {
  utils.logHeader(`📦 Prepare files`);

  const currentBasePath = `${options.basePath}/reports/current.json`;
  const destinationBasePath = `${options.basePath}/reports/reports/${options.date}`;
  if (!fs.existsSync(destinationBasePath)) {
    await fs.promises.mkdir(destinationBasePath);
  }

  /**
   * Redefining current
   */
  if (fs.existsSync(currentBasePath)) {
    await fs.promises.unlink(currentBasePath);
  }
  await fs.promises.copyFile(
    `${options.destinationPath}/../current.json`,
    currentBasePath
  );

  /**
   * Moving report
   */
  if (fs.existsSync(`${destinationBasePath}/report.json`)) {
    await fs.promises.unlink(`${destinationBasePath}/report.json`);
  }
  await fs.promises.copyFile(
    `${options.destinationPath}/report.json`,
    `${destinationBasePath}/report.json`
  );
};
