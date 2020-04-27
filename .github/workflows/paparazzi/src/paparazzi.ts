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
  }

  /**
   *  TODO
   */
  setup = async () => {
    try {
      this.createScaffold()
      this.printer.header(`✨ Setting up the folder structure - ${this.date}`)
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  getCurrent = async () => {
    try {
      this.printer.header(
        `🔍 Checking out the last capture session - ${this.date}`
      )
      const capture = new Capture(this.config)
      await capture.getCurrent()
      await capture.downloadCurrent()
      await capture.close()
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  setCurrent = async () => {
    try {
      this.printer.header(`✨ Updating the current report - ${this.date}`)
      const capture = new Capture(this.config)
      await capture.setCurrent()
      await capture.close()
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  capture = async () => {
    try {
      this.printer.subHeader(`🤓 Creating a new caputre session`)
      const capture = new Capture(this.config)
      await capture.capture()
      await capture.close()
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  resize = async () => {
    try {
      this.printer.subHeader(`📦 Resize images`)
      const capture = new Capture(this.config)
      await capture.resize()
      await capture.close()
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  compare = async () => {
    try {
      this.printer.subHeader(`🤔 Compare images`)
      const capture = new Capture(this.config)
      await capture.compareReports()
      await capture.close()
    } catch (e) {
      throw e
    }
  }

  /**
   *  Create the folder structure needed for capturing the screens
   */
  createScaffold = async () => {
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
  process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0], // date
  '../../../..' // basepath
)

/**
 *  TODO
 */
switch (process.argv[2]) {
  case 'setup': {
    paparazzi.setup()
    break
  }
  case 'getcurrent': {
    paparazzi.getCurrent()
    break
  }
  case 'capture': {
    paparazzi.capture()
    break
  }
  case 'resize': {
    paparazzi.resize()
    break
  }
  case 'compare': {
    paparazzi.compare()
    break
  }
  case 'setcurrent': {
    paparazzi.setCurrent()
    break
  }
  default: {
    //statements;
    break
  }
}
