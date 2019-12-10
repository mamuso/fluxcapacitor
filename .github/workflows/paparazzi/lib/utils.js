"use strict";
/**
 * Silly utilities, mostly for logging
 */

module.exports.logHeader = text => {
  console.log("");
  console.log(
    "-----------------------------------------------------------------------"
  );
  console.log(`${text}`);
  console.log(
    "-----------------------------------------------------------------------"
  );
};

module.exports.logSubheader = text => {
  console.log("");
  console.log(`${text}`);
  console.log(
    "-----------------------------------------------------------------------"
  );
};

module.exports.logCaptureURL = text => {
  console.log(`  └ 🏙  ${text}`);
};

module.exports.logCompareURL = text => {
  console.log(`  └ 🎆  ${text}`);
};
