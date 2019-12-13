"use strict";
/**
 * Write reports!
 */

const fs = require("fs");
const utils = require("./utils");

const indexPath = "../../../../reports/index/";

module.exports = async (screensList, { ...options } = {}) => {
  utils.logHeader(`📊 Reporting`);

  /**
   * Write the report.json file in the destination folder
   */
  fs.writeFileSync(`${options.path}/report.json`, JSON.stringify(screensList));

  /**
   * TODO: reduce screensList to a list with unique screenIdSlugs
   */
  // uniqueReducedList.forEach(s => {
  //   if (!fs.existsSync(indexPath)) {
  //     console.log(fs.existsSync(`${indexPath}/${s.screenIdSlug}.json`));
  //   }
  // });
  fs.writeFileSync(
    `${options.path}/../current.json`,
    JSON.stringify({ current: options.date })
  );
};
