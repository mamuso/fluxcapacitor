/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env'
import {Config} from './lib/interfaces'
import Printer from './lib/utils'
import Capture from './lib/capture'
import * as fs from 'fs'

const basePath: string = fs.existsSync('/github/workspace/repo')
  ? '/github/workspace/repo'
  : '../../../..'
const date: string = new Date().toISOString().split('T')[0]
const tmp: string = 'tmp'

const config: Config = {
  date: date,
  basePath: basePath,
  tmpPath: tmp,
  tmpDatePath: `${tmp}/${date}`,
  tmpCurrentPath: `${tmp}/current`,
  ...require(`${basePath}/timesled-config`)
}

const printer = new Printer()
const capture = new Capture(config)

async function paparazzi() {
  printer.header(`✨ Paparazzi - ${date}`)

  /** Create tmp folders */
  // if (!fs.existsSync(config.tmpPath)) {
  //   await fs.promises.mkdir(config.tmpPath)
  // }
  // if (!fs.existsSync(config.tmpDatePath)) {
  //   await fs.promises.mkdir(config.tmpDatePath)
  // }
  // if (!fs.existsSync(config.tmpCurrentPath)) {
  //   await fs.promises.mkdir(config.tmpCurrentPath)
  // }

  /** Capture */
  const screensList = await capture.capture()
}

paparazzi()
