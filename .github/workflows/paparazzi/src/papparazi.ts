/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */

import './lib/env'
import {Printer} from './lib/utils'
import * as fs from 'fs'

const printer = new Printer()

const basePath = fs.existsSync('/github/workspace/repo')
  ? '/github/workspace/repo'
  : '../../../..'
const date = new Date().toISOString().split('T')[0]
const tmp = 'tmp'
const config = {
  date: date,
  basePath: basePath,
  tmpPath: tmp,
  tmpDatePath: `${tmp}/${date}`,
  tmpCurrentPath: `${tmp}/current`,
  ...require(`${basePath}/timesled-config`)
}

async function capture() {
  printer.header(`✨ Paparazzi - ${date}`)

  /** Create tmp folders */
  if (!fs.existsSync(config.tmpPath)) {
    await fs.promises.mkdir(config.tmpPath)
  }
  if (!fs.existsSync(config.tmpDatePath)) {
    await fs.promises.mkdir(config.tmpDatePath)
  }
  if (!fs.existsSync(config.tmpCurrentPath)) {
    await fs.promises.mkdir(config.tmpCurrentPath)
  }

  return 'Gilad'
}

capture()
