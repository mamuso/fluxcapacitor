/* eslint-disable no-console */

/**
 * Capture a list of urls with puppeteer.
 */

import {Config, Device, Page} from './types'
import Printer from './utils'
import DB from './db'
import store from './store'
import * as fs from 'fs'
import slugify from '@sindresorhus/slugify'
import puppeteer from 'puppeteer'

export default class Capture {
  printer = new Printer()
  config = {} as Config
  store
  db
  dbdevice
  dbreport
  dbpage
  dbcapture

  constructor(config: Config) {
    this.config = {...config}
    this.db = new DB({...config})
    this.store = new store({...config})
  }

  capture = async (): Promise<boolean> => {
    this.printer.header(`📷 Capture URLs`)

    /** DB report */
    this.dbreport = await this.db.createreport()

    /** Looping through devices */
    let i = 0
    const iMax = this.config.devices.length
    for (; i < iMax; i++) {
      /** Configure device */
      const captureDevice = this.config.devices[i]
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const puppet = await browser.newPage()
      let device = (captureDevice.device
        ? puppeteer.devices[captureDevice.device]
        : captureDevice) as Device
      device.userAgent = device.userAgent || (await browser.userAgent())
      await puppet.emulate(device)

      this.printer.subheader(
        `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
      )

      /** Make device folder */
      if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
        await fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`)
      }

      /** DB device */
      this.dbdevice = await this.db.createdevice(device)

      /** Looping through URLs */
      let j = 0
      const jMax = this.config.pages.length
      for (; j < jMax; j++) {
        const page: Page = this.config.pages[j]
        const fileName = `${slugify(page.id)}.${this.config.format}`
        const localFilePath = `${this.config.tmpDatePath}/${device.id}/${fileName}`

        /** DB page */
        this.dbpage = await this.db.createpage(page)

        this.printer.capture(page.id)

        await puppet.goto(page.url)
        await puppet.screenshot({
          path: localFilePath,
          fullPage: page.fullPage
        })

        // Compare

        // Resize

        // Upload
        await this.store.uploadfile(
          this.config.date,
          device.id,
          fileName,
          localFilePath
        )

        // Write capture in the DB
        this.dbcapture = await this.db.createcapture(
          this.dbreport,
          this.dbdevice,
          this.dbpage
        )
      }

      await browser.close()
    }
    await this.db.prisma.disconnect()
    return true
  }
}
