/* eslint-disable no-console */

/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env'
import {Config} from './lib/types'
import Printer from './lib/utils'
import Capture from './lib/capture'
import * as fs from 'fs'

class Paparazzi {
  date
  basePath
  config
  printer

  constructor(date: string, basePath: string, tmpPath: string = 'tmp') {
    this.printer = new Printer()
    this.date = date
    this.basePath = basePath
    this.config = {
      date: this.date,
      basePath: this.basePath,
      tmpPath: tmpPath,
      tmpDatePath: `${tmpPath}/${this.date}`,
      tmpCurrentPath: `${tmpPath}/current`,
      ...require(`${this.basePath}/fluxcapacitor-config`)
    } as Config

    this.process()
  }

  process = async (): Promise<void> => {
    try {
      this.setup()
      this.printer.header(`✨ Paparazzi - ${this.date}`)
      const capture = new Capture(this.config)
      await capture.capture()
      await this.cleanup()
    } catch (e) {}
  }

  /**
   *  Create the folder structure needed for capturing the screens
   */
  setup = async () => {
    if (!fs.existsSync(this.config.tmpPath)) {
      await fs.promises.mkdir(this.config.tmpPath)
    }
    if (!fs.existsSync(this.config.tmpDatePath)) {
      await fs.promises.mkdir(this.config.tmpDatePath)
    }
    if (!fs.existsSync(this.config.tmpCurrentPath)) {
      await fs.promises.mkdir(this.config.tmpCurrentPath)
    }
  }

  /**
   *  Remove the folder structure needed for capturing the screens
   */
  cleanup = async () => {
    await fs.promises.rmdir(this.config.tmpPath, {recursive: true})
  }
}

const paparazzi = new Paparazzi(
  new Date().toISOString().split('T')[0], // date
  '../../../..' // basepath
)
