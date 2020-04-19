/* eslint-disable no-console */

/**
 * Capture a list of urls with puppeteer.
 */

import {Config, Device, Page, Report, CaptureType} from './types'
import Printer from './utils'
import Store from './store'
import Compare from './compare'
import Compress from './compress'
import Notify from './notify'
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
  compare
  compress
  db
  dbdevice
  dbreport
  current
  notify

  constructor(config: Config) {
    this.printer = new Printer()
    this.config = {...config} as Config
    this.compare = new Compare({...config})
    this.compress = new Compress({...config})
    this.store = new Store({...config})
    this.db = new DB({...config})
    this.notify = new Notify({...config})
  }

  capture = async () => {
    try {
      /** Set current and download report */
      this.printer.subheader(`🔍 Checking out the last capture session`)
      await this.getcurrent()

      /** DB report */
      this.printer.subheader(`🤓 Creating a new caputre session`)
      this.dbreport = await this.db.createreport()

      this.printer.header(`📷 Capture URLs`)

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
          /** Setting all the variables */
          const page: Page = this.config.pages[j]
          const filename = `${slugify(page.id)}.${this.config.format}`
          const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`
          const currentfilepath = `${this.config.tmpCurrentPath}/${device.id}/${filename}`
          const filenamemin = `${slugify(page.id)}-min.jpg`
          const localfilepathmin = `${this.config.tmpDatePath}/${device.id}/${filenamemin}`
          const filenamediff = `${slugify(page.id)}-diff.${this.config.format}`
          const localfilepathdiff = `${this.config.tmpDatePath}/${device.id}/${filenamediff}`
          const capture = {} as CaptureType

          if (page.auth) {
            if (this.config.auth.cookie) {
              await puppet.setCookie({
                value: 'yes',
                domain: `${process.env.FLUX_DOMAIN}`,
                expires: Date.now() / 1000 + 100,
                name: 'logged_in'
              })
              await puppet.setCookie({
                value: `${process.env.FLUX_COOKIE}`,
                domain: `${process.env.FLUX_DOMAIN}`,
                expires: Date.now() / 1000 + 100,
                name: 'user_session'
              })
            } else {
              await puppet.goto(this.config.auth.url, {
                waitUntil: 'load'
              })
              // Login
              await puppet.type(
                this.config.auth.username,
                `${process.env.FLUX_LOGIN}`
              )
              await puppet.type(
                this.config.auth.password,
                `${process.env.FLUX_PASSWORD}`
              )
              await puppet.click(this.config.auth.submit)

              // Get cookies
              // this.cookies = await puppet.cookies()
            }
          }

          await puppet.goto(page.url, {waitUntil: 'load'})

          // Scrolling through the page
          const vheight = await puppet.viewport().height
          const pheight = await puppet.evaluate(_ => {
            return document.body.scrollHeight
          })
          let v
          while (v + vheight < pheight) {
            await puppet.evaluate(_ => {
              window.scrollBy(0, v)
            })
            await puppet.waitFor(500)
            v = v + vheight
          }
          await puppet.waitFor(1000)

          await puppet.screenshot({
            path: localfilepath,
            fullPage: page.fullPage
          })

          /** DB page */
          const dbpage = await this.db.createpage(page, this.dbreport)
          capture.page = dbpage.id

          /** Resize main image */
          await sharp(localfilepath)
            .resize({
              width: 800,
              height: 600,
              position: sharp.position.top,
              withoutEnlargement: true
            })
            .toFile(localfilepathmin)

          /** Compare */
          const diff = await this.compare.compare(
            localfilepath,
            currentfilepath,
            localfilepathdiff
          )

          if (diff != 0) {
            capture.diff = true
            capture.diffindex = diff
          } else {
            capture.diff = false
          }

          /** Upload images */
          capture.url = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filename}`,
            localfilepath
          )

          capture.urlmin = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filenamemin}`,
            localfilepathmin
          )

          if (diff > 0) {
            capture.urldiff = await this.store.uploadfile(
              `${this.config.date}/${device.id}/${filenamediff}`,
              localfilepathdiff
            )
          }

          capture.slug = slugify(
            `${this.dbreport.slug}-${this.dbdevice.slug}-${page.slug}`
          )

          /** Write capture in the DB */
          await this.db.createcapture(
            this.dbreport,
            this.dbdevice,
            dbpage,
            capture
          )

          /** Print output */
          this.printer.capture(page.id)
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

      // await this.notify.send()

      /** Disconnect from the DB */
      await this.db.prisma.disconnect()
    } catch (e) {
      throw e
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
