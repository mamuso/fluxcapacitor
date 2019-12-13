"use strict";
/**
 * Write reports!
 */

const fs = require("fs");
const utils = require("./utils");

module.exports = async (screensList, { ...options } = {}) => {
  utils.logHeader(`📊 Reporting`);

  const reportFilePath = `${options.path}/report.json`;
  const currentFilePath = `${options.path}/../current.json`;

  /**
   * Write the report.json file in the destination folder
   */
  fs.writeFileSync(reportFilePath, JSON.stringify(screensList));

  /**
   * TODO: reduce screensList to a list with unique screenIdSlugs
   */
  // uniqueReducedList.forEach(s => {
  //   if (!fs.existsSync(indexPath)) {
  //     console.log(fs.existsSync(`${indexPath}/${s.screenIdSlug}.json`));
  //   }
  // });

  fs.writeFileSync(currentFilePath, JSON.stringify({ current: options.date }));
};
