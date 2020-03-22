"use strict";
/**
 * Write reports!
 */

const fs = require("fs");
const utils = require("./utils");

module.exports = async ({ ...config } = {}) => {
  utils.logHeader(`📊 Reporting`);

  const reportFilePath = `${config.tmpDatePath}/report.json`;
  const currentFilePath = `${config.tmpDatePath}/../current.json`;

  /** Write the report.json file in the destination folder */
  fs.writeFileSync(reportFilePath, JSON.stringify(config.screensList));

  /**
   * TODO: reduce screensList to a list with unique screenIdSlugs
   */
  // uniqueReducedList.forEach(s => {
  //   if (!fs.existsSync(indexPath)) {
  //     console.log(fs.existsSync(`${indexPath}/${s.screenIdSlug}.json`));
  //   }
  // });

  fs.writeFileSync(currentFilePath, JSON.stringify({ current: config.date }));
};
