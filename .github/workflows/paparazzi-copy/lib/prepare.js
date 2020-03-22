"use strict";
/**
 * Prepare files for the final step
 */

const fs = require("fs");
const utils = require("./utils");

module.exports = async ({ ...config } = {}) => {
  utils.logHeader(`📦 Prepare files`);

  const currentBasePath = `${config.basePath}/reports/current.json`;
  const destinationBasePath = `${config.basePath}/reports/reports/${config.date}`;

  if (fs.existsSync(destinationBasePath)) {
    await fs.promises.rmdir(destinationBasePath, { recursive: true });
  }
  await fs.promises.mkdir(destinationBasePath);

  /** Redefining current */
  if (fs.existsSync(currentBasePath)) {
    await fs.promises.unlink(currentBasePath);
  }
  await fs.promises.copyFile(
    `${config.tmpDatePath}/../current.json`,
    currentBasePath
  );

  /** Moving report */
  if (fs.existsSync(`${destinationBasePath}`)) {
  }

  if (config.storage == "repo") {
    /** If we are storing assets in the repo, we move all the files */
    /** TODO: async */
    await fs.readdir(config.tmpDatePath, (err, files) => {
      files.forEach(file => {
        fs.copyFileSync(
          `${config.tmpDatePath}/${file}`,
          `${destinationBasePath}/${file}`
        );
      });
    });
  } else {
    await fs.promises.copyFile(
      `${config.tmpDatePath}/report.json`,
      `${destinationBasePath}/report.json`
    );
  }
};
