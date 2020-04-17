/* eslint-disable no-console */

/**
 * Capture a list of urls with puppeteer.
 */

import {Config, Device, Page, Report, CaptureType} from './types'
import Printer from './utils'
import Store from './store'
import Compress from './compress'
import DB from './db'
import * as fs from 'fs'
import * as rp from 'request-promise'
import sharp from 'sharp'
import slugify from '@sindresorhus/slugify'
import puppeteer from 'puppeteer'

export default class Capture {
  printer
  config
  store
  compress
  db
  dbdevice
  dbreport
  current

  constructor(config: Config) {
    this.printer = new Printer()
    this.config = {...config} as Config
    this.compress = new Compress({...config})
    this.store = new Store({...config})
    this.db = new DB({...config})
  }

  capture = async () => {
    try {
      this.printer.header(`📷 Capture URLs`)

      /** Set current and download report */
      await this.getcurrent()

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
          const filename = `${slugify(page.id)}.${this.config.format}`
          const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`
          const filenamemin = `${slugify(page.id)}-min.jpg`
          const localfilepathmin = `${this.config.tmpDatePath}/${device.id}/${filenamemin}`
          const filenamediff = `${slugify(page.id)}-diff.${this.config.format}`
          const localfilepathdiff = `${this.config.tmpDatePath}/${device.id}/${filenamediff}`
          const capture = {} as CaptureType

          this.printer.capture(page.id)

          await puppet.goto(page.url)
          await puppet.screenshot({
            path: localfilepath,
            fullPage: page.fullPage
          })

          /** DB page */
          const dbpage = await this.db.createpage(page, this.dbreport)
          capture.page = dbpage.id

          /** Upload main image */
          capture.url = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filename}`,
            localfilepath
          )

          /** Resize and upload main image */
          await sharp(localfilepath)
            .resize({
              width: 600,
              height: 800,
              position: 'top'
            })
            .toFile(localfilepathmin)

          capture.urlmin = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filenamemin}`,
            localfilepathmin
          )

          capture.slug = slugify(
            `${this.dbreport.slug}-${this.dbdevice.slug}-${page.slug}`
          )

          /** Write capture in the DB */
          await this.db.createcapture(this.dbreport, this.dbdevice, dbpage)
        }

        await browser.close()
      }

      /** Compress folder, upload it, and updates the db */
      this.printer.subheader(`🤐 Zipping screenshots`)

      const zipname = `${this.config.date}.tgz`
      await this.compress.dir(
        this.config.tmpDatePath,
        `${this.config.tmpPath}/${zipname}`
      )
      const zipurl = await this.store.uploadfile(
        `archive/${zipname}`,
        `${this.config.tmpPath}/${zipname}`
      )

      await this.db.updatereporturl(this.dbreport, zipurl)

      /** Update the current report */
      await this.db.setcurrent(this.dbreport.id)

      /** Disconnect from the DB */
      await this.db.prisma.disconnect()
    } catch (e) {
      console.log(e)
    }
  }

  getcurrent = async () => {
    const current = await this.db.getcurrent()
    this.current = current[0] ? current[0] : null

    if (this.current) {
      const res = await rp.get({uri: this.current.url, encoding: null})
      fs.writeFileSync(`${this.config.tmpPath}/current.tgz`, res, {
        encoding: null
      })

      await this.compress.extract(
        `${this.config.tmpPath}/current.tgz`,
        this.config.tmpCurrentPath
      )
    }
  }
}
