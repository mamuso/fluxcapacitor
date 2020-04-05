/* eslint-disable no-console */

/**
 * Capture a list of urls with puppeteer.
 */

import {Config, Device} from './types'
import Printer from './utils'
import slugify from '@sindresorhus/slugify'
import puppeteer from 'puppeteer'

export default class Capture {
  printer = new Printer()
  config = {} as Config

  constructor(config: Config) {
    this.config = {...config}
  }

  capture = async (): Promise<boolean> => {
    this.printer.header(`📷 Capture URLs`)

    /** Looping through devices */
    let i = 0
    const iMax = this.config.devices.length
    for (; i < iMax; i++) {
      const captureDevice = this.config.devices[i]
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      const page = await browser.newPage()

      let device = (captureDevice.device
        ? puppeteer.devices[captureDevice.device]
        : captureDevice) as Device
      device.userAgent = device.userAgent || (await browser.userAgent())
      await page.emulate(device)

      this.printer.subheader(
        `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
      )

      await browser.close()
    }
    // console.log(this.config)
    return true
  }
}

// const puppeteer = require('puppeteer')
// const slugify = require('slugify')
// const utils = require('./utils')

// const screens = []
// module.exports = async ({...config} = {}) => {
//   utils.logHeader(`📷 Capture URLs`)

//   /** Looping through devices */
//   let i = 0
//   const iMax = config.devices.length
//   for (; i < iMax; i++) {
//     const captureDevice = config.devices[i]
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     })

//     const page = await browser.newPage()
//     let device = captureDevice.device
//       ? puppeteer.devices[captureDevice.device]
//       : captureDevice
//     device.userAgent = device.userAgent || (await browser.userAgent())
//     await page.emulate(device)

//     utils.logSubheader(
//       `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
//     )

//     /** Looping through URLs */
//     let j = 0
//     const jMax = config.urls.length
//     for (; j < jMax; j++) {
//       const captureData = config.urls[j]
//       const fileName = `${captureDevice.id}-${slugify(captureData.id)}.${
//         config.format
//       }`

//       const localFilePath = `${config.tmpDatePath}/${fileName}`
//       await page.goto(captureData.url)
//       await page.screenshot({
//         path: localFilePath,
//         fullPage: captureData.fullPage
//       })

//       await screens.push({
//         id: `${captureDevice.id}-${slugify(captureData.id)}`,
//         screenId: captureData.id,
//         screenIdSlug: slugify(captureData.id),
//         screenName: fileName,
//         screenPath: localFilePath,
//         diff: false
//       })

//       utils.logCaptureURL(captureData.id)
//     }
//     await browser.close()
//   }
//   return screens
// }
