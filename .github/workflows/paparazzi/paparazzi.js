"use strict";
/**
 * Paparazzi
 * A GitHub action to capture, compare, minify and store screenshots
 */

const fs = require("fs");
const capture = require("./lib/capture");
const compare = require("./lib/compare");
const minify = require("./lib/minify");
const store = require("./lib/store");
const report = require("./lib/report");
const utils = require("./lib/utils");
const prepare = require("./lib/prepare");
const dotenv = require("dotenv");
dotenv.config();

const basePath = fs.existsSync("/github/workspace/repo")
  ? "/github/workspace/repo"
  : "../../..";
const tmp = "tmp";
const date = new Date().toISOString().split("T")[0];

const config = {
  date: date,
  basePath: basePath,
  tmpPath: tmp,
  tmpDatePath: `${tmp}/${date}`,
  tmpCurrentPath: `${tmp}/current`,
  ...require(`${basePath}/timesled-config`)
};

(async () => {
  utils.logHeader(`✨ Paparazzi - ${date}`);

  /** Create tmp folders */
  if (!fs.existsSync(config.tmpPath)) {
    await fs.promises.mkdir(config.tmpPath);
  }
  if (!fs.existsSync(config.tmpDatePath)) {
    await fs.promises.mkdir(config.tmpDatePath);
  }
  if (!fs.existsSync(config.tmpCurrentPath)) {
    await fs.promises.mkdir(config.tmpCurrentPath);
  }

  /** Capture */
  const screensList = await capture(config);

  /**
   * TODO: Checkout current
   */

  /** Minify */
  if (config.minify) {
    await minify(config);
  }

  /** Compare */
  if (config.compare) {
    const diffList = await compare(config);
    if (config.minify) {
      await minify({ pattern: "*-diff", ...config });
    }

    diffList.forEach(d => {
      screensList.find(s => s.id === d.id).diff = true;
    });
  }

  /** Report */
  await report({ screensList, ...config });

  /** Prepare */
  await prepare(config);

  /** Clean tmp folder */
  await fs.promises.rmdir(config.tmpPath, { recursive: true });
})();
