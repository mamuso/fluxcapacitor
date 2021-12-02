import './lib/env';
import * as fs from 'fs';
import Capture from './lib/capture';
import { Config } from './lib/types';
import { Printer } from './lib/utils';

export class Paparazzi {
  public config: Config;
  private printer: Printer;

  /**
   * Handles the capture, storage and notification of a list of URLs.
   *
   * @param date - The day of the capture. Format: YYYY-MM-DD
   * @param configFile - Location of the config.json file. Default: ../../config
   * @returns A report of the capture.
   *
   */

  constructor(
    public date: string,
    public configFile: string = '../../config',
    public tmpPath: string = 'tmp'
  ) {
    this.printer = new Printer();
    this.config = {
      date: date,
      tmpPath: tmpPath,
      tmpDatePath: `${tmpPath}/${date}`,
      tmpCurrentPath: `${tmpPath}/current`,
      ...require(configFile),
    };
  }

  /**
   *  Run all the tasks needed to kick off the process
   */
  setup = async (): Promise<void> => {
    this.createScaffold();
    this.printer.header(
      `✨ Setting up the folder structure - ${this.config.date}`
    );
  };

  /**
   *  Create the folder structure needed for capturing the screens
   */
  createScaffold = async (): Promise<void> => {
    if (!fs.existsSync(this.config.tmpPath)) {
      await fs.promises.mkdir(this.config.tmpPath);
    }
    if (!fs.existsSync(this.config.tmpDatePath)) {
      await fs.promises.mkdir(this.config.tmpDatePath);
    }
    if (!fs.existsSync(this.config.tmpCurrentPath)) {
      await fs.promises.mkdir(this.config.tmpCurrentPath);
    }
  };

  /**
   *  Remove the folder structure needed for capturing the screens
   */
  cleanup = async (): Promise<void> => {
    await fs.promises.rmdir(this.config.tmpPath, { recursive: true });
  };

  /**
   *  Capture screenshots of all the endpoints in the config file
   */
  capture = async (): Promise<void> => {
    try {
      this.printer.subHeader(`🤓 Creating a new caputre session`);
      const capture = new Capture(this.config);
      await capture.capture();
    } catch (e) {
      throw e;
    }
  };
}
