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
import * as path from 'path'
import * as fs from 'fs'
import * as rp from 'request-promise'
import sharp from 'sharp'
import slugify from '@sindresorhus/slugify'
import puppeteer from 'puppeteer'

export default class Capture {
  browser
  compare
  compress
  config
  current
  db
  dbDevice
  dbReport
  notify
  printer
  store

  constructor(config: Config) {
    this.printer = new Printer()
    this.config = {...config} as Config
    this.compare = new Compare({...config})
    this.compress = new Compress({...config})
    this.store = new Store({...config})
    this.db = new DB({...config})
    this.notify = new Notify({...config})
  }

  captureOLD = async () => {
    try {
      /** Set current and download report */
      this.printer.subHeader(`🔍 Checking out the last capture session`)
      await this.getcurrent()

      /** DB report */
      this.printer.subHeader(`🤓 Creating a new caputre session`)
      this.dbReport = await this.db.createReport()

      this.printer.header(`📷 Capture URLs`)

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      /** Looping through devices */
      let i = 0
      const iMax = this.config.devices.length
      for (; i < iMax; i++) {
        /** Configure device */
        const captureDevice = this.config.devices[i]
        const puppet = await browser.newPage()
        let device = (captureDevice.device
          ? puppeteer.devices[captureDevice.device]
          : captureDevice) as Device
        device.userAgent = device.userAgent || (await browser.userAgent())
        device.id = captureDevice.id

        await puppet.emulate(device)

        this.printer.subHeader(
          `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
        )

        /** Make device folder */
        if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
          await fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`)
        }

        /** DB device */
        this.dbDevice = await this.db.createDevice(device)

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
          let diff = null

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
            await puppet.waitFor(350)
            v = v + vheight
          }
          await puppet.waitFor(800)

          await puppet.screenshot({
            path: localfilepath,
            fullPage: page.fullPage
          })

          /** DB page */
          const dbpage = await this.db.createPage(page, this.dbReport)
          capture.page = dbpage.id

          if (this.current) {
            const currentpath = `${this.config.tmpCurrentPath}/${device.id}`
            if (!fs.existsSync(currentpath)) {
              await fs.promises.mkdir(currentpath)
            }
            const currentcapture = await this.db.getcurrentcapture(
              dbpage,
              this.current,
              this.dbDevice
            )
            if (currentcapture[0] && currentcapture[0].url) {
              const res = await rp.get({
                uri: currentcapture[0].url,
                encoding: null
              })
              fs.writeFileSync(`${currentfilepath}`, res, {
                encoding: null
              })
            }

            /** Compare */
            diff = await this.compare.compare(
              localfilepath,
              currentfilepath,
              localfilepathdiff
            )
          }

          if (diff && diff !== 0) {
            capture.diff = true
            capture.diffindex = diff
          } else {
            capture.diff = false
          }

          /** Resize main image */
          await sharp(localfilepath)
            .resize({
              width: 800,
              height: 600,
              position: sharp.position.top,
              withoutEnlargement: true
            })
            .toFile(localfilepathmin)

          /** Upload images */
          capture.url = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filename}`,
            localfilepath
          )

          capture.urlmin = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filenamemin}`,
            localfilepathmin
          )

          if (diff && diff > 0) {
            capture.urldiff = await this.store.uploadfile(
              `${this.config.date}/${device.id}/${filenamediff}`,
              localfilepathdiff
            )
          }

          capture.slug = slugify(
            `${this.dbReport.slug}-${this.dbDevice.slug}-${page.slug}`
          )

          /** Write capture in the DB */
          await this.db.createCapture(
            this.dbReport,
            this.dbDevice,
            dbpage,
            capture
          )

          /** Print output */
          this.printer.capture(page.id)
        }
        await browser.close()
      }

      /** Compress folder, upload it, and updates the db */
      // this.printer.subHeader(`🤐 Zipping screenshots`)

      // const zipname = `${this.config.date}.tgz`
      // await this.compress.dir(
      //   this.config.tmpDatePath,
      //   `${this.config.tmpPath}/${zipname}`
      // )
      // const zipurl = await this.store.uploadfile(
      //   `archive/${zipname}`,
      //   `${this.config.tmpPath}/${zipname}`
      // )

      // await this.db.updatereporturl(this.dbReport, zipurl)

      /** Update the current report */
      await this.db.setcurrent(this.dbReport.id)

      // await this.notify.send()

      /** Disconnect from the DB */
      await this.db.prisma.disconnect()
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  getcurrent = async () => {
    const currentdb = await this.db.getcurrent()
    this.current = currentdb[0] ? currentdb[0] : null
  }

  /**
   *  TODO
   */
  downloadcurrent = async () => {
    await this.current.captures.forEach(async capture => {
      const filepath = capture.url.split(this.current.slug)[1]
      const currentpath = `${this.config.tmpCurrentPath}${filepath}`

      this.printer.download(filepath)

      if (!fs.existsSync(path.dirname(currentpath))) {
        fs.mkdirSync(path.dirname(currentpath))
      }

      const res = await rp.get({
        uri: capture.url,
        encoding: null
      })

      await fs.promises.writeFile(currentpath, res, {
        encoding: null
      })
    })
  }

  /**
   *  TODO
   */
  capture = async () => {
    try {
      this.printer.header(`📷 Capture URLs`)

      this.dbReport = await this.db.createReport()

      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      /** Looping through devices */
      let i = 0
      const iMax = this.config.devices.length
      for (; i < iMax; i++) {
        const device = await this.setDevice(this.config.devices[i])

        this.printer.subHeader(
          `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
        )

        /** Make device folder */
        if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
          await fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`)
        }

        /** DB device */
        this.dbDevice = await this.db.createDevice(device)

        /** Looping through URLs */
        let j = 0
        const jMax = this.config.pages.length
        for (; j < jMax; j++) {
          const page: Page = this.config.pages[j]
          const filename = `${slugify(page.id)}.${this.config.format}`
          const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`
          const capture = {} as CaptureType

          this.printer.capture(`Capturing ${page.id}`)

          const puppet = await this.browser.newPage()
          await puppet.emulate(device)

          /** Authenticating if needed */
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
            await puppet.waitFor(150)
            v = v + vheight
          }
          await puppet.waitFor(500)

          await puppet.screenshot({
            path: localfilepath,
            fullPage: page.fullPage
          })

          puppet.close()

          /** DB page */
          const dbpage = await this.db.createPage(page, this.dbReport)
          capture.page = dbpage.id

          /** Upload images */
          capture.url = await this.store.uploadfile(
            `${this.config.date}/${device.id}/${filename}`,
            localfilepath
          )

          /** Write capture in the DB */
          await this.db.createCapture(
            this.dbReport,
            this.dbDevice,
            dbpage,
            capture
          )
        }
      }
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  resize = async () => {
    try {
      this.dbReport = await this.db.createReport()
      let i = 0
      const iMax = this.config.devices.length
      for (; i < iMax; i++) {
        /** DB device */
        this.dbDevice = await this.db.getDevice(this.config.devices[i])

        this.printer.subHeader(`🖥  ${this.dbDevice.slug}`)

        /** Looping through URLs */
        let j = 0
        const jMax = this.config.pages.length
        for (; j < jMax; j++) {
          const page: Page = this.config.pages[j]
          const filename = `${slugify(page.id)}.${this.config.format}`
          const localfilepath = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filename}`
          const filenamemin = `${slugify(page.id)}-min.jpg`
          const localfilepathmin = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filenamemin}`

          this.printer.resize(`Resizing ${page.id}`)

          const dbpage = await this.db.createPage(page, this.dbReport)
          const capture = await this.db.getCapture(
            this.dbReport,
            this.dbDevice,
            dbpage
          )

          /** Resize captured image */
          await sharp(localfilepath)
            .resize({
              width: 800,
              height: 600,
              position: sharp.position.top,
              withoutEnlargement: true
            })
            .toFile(localfilepathmin)

          capture.urlmin = await this.store.uploadfile(
            `${this.config.date}/${this.dbDevice.slug}/${filenamemin}`,
            localfilepathmin
          )

          /** Write capture in the DB */
          await this.db.createCapture(
            this.dbReport,
            this.dbDevice,
            dbpage,
            capture
          )
        }
      }
    } catch (e) {
      throw e
    }
  }

  /**
   *  TODO
   */
  setDevice = async (configdevice: Device) => {
    let device = (configdevice.device
      ? puppeteer.devices[configdevice.device]
      : configdevice) as Device
    device.userAgent = device.userAgent || (await this.browser.userAgent())
    device.id = configdevice.id

    return device
  }

  /**
   *  TODO
   */
  close = async () => {
    /** Close browser session */
    if (this.browser) {
      await this.browser.close()
    }

    if (this.db.prisma) {
      /** Disconnect from the DB */
      await this.db.prisma.disconnect()
    }
  }
}
