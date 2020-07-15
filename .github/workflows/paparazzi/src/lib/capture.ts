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
import glob from 'glob'
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

  /**
   *  TODO
   */
  getCurrent = async () => {
    const currentdb = await this.db.getCurrent()
    this.current = currentdb[0] ? currentdb[0] : null
  }

  /**
   *  TODO
   */
  setCurrent = async () => {
    this.dbReport = await this.db.createReport()
    await this.db.setCurrent(this.dbReport.id)
  }

  /**
   *  TODO
   */
  downloadCurrent = async () => {
    if (this.current && this.current.captures) {
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
        defaultViewport: null,
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

          await puppet.goto(page.url, {
            waitUntil: 'networkidle2',
            timeout: 30000
          })

          await puppet._client.send('Animation.setPlaybackRate', {
            playbackRate: 2
          })
          const scrollHeight = await puppet.evaluate(_ => {
            return document.body.scrollHeight
          })

          // If the page is bigger than two times the viewport
          if (scrollHeight > 2 * device.viewport.height) {
            let s = 0
            let scrollTo = 0
            const safeSpace = 400
            // We leave a few pixels between snapshots to stich free of header duplications
            const scrollSafe = device.viewport.height - safeSpace
            while (scrollTo <= scrollHeight) {
              await puppet.evaluate(
                ({scrollTo}) => {
                  window.scrollTo(0, scrollTo)
                },
                {scrollTo}
              )
              await puppet.waitFor(250)

              const buffer = await puppet.screenshot({
                fullPage: false
              })

              await fs.promises.writeFile(
                `${this.config.tmpDatePath}/tmpshot-${s}.png`,
                buffer,
                {
                  encoding: null
                }
              )
              s += 1
              scrollTo += scrollSafe
              console.log(`${this.config.tmpDatePath}/tmpshot-${s}.png`)
            }

            let composite = new Array()
            let topComposite = 0

            for (let i = 0; i < s; i++) {
              const fileIn = `${this.config.tmpDatePath}/tmpshot-${i}.png`
              const fileOut = `${this.config.tmpDatePath}/tmpshot-${i}r.png`
              let height = 0
              let image = await sharp(fileIn)

              switch (i) {
                case 0:
                  height =
                    (device.viewport.height - safeSpace / 2) *
                    device.deviceScaleFactor
                  await image
                    .resize({
                      width: device.viewport.width * device.deviceScaleFactor,
                      height: height,
                      position: sharp.position.top
                    })
                    .toFile(fileOut)

                  composite.push({
                    input: fileOut,
                    top: 0,
                    left: 0
                  })
                  break
                case s - 1:
                  height =
                    (device.viewport.height - safeSpace / 2) *
                    device.deviceScaleFactor
                  await image
                    .resize({
                      width: device.viewport.width * device.deviceScaleFactor,
                      height: height,
                      position: sharp.position.bottom
                    })
                    .toFile(fileOut)

                  composite.push({
                    input: fileOut,
                    gravity: 'southwest'
                  })
                  break
                default:
                  height =
                    (device.viewport.height - safeSpace) *
                    device.deviceScaleFactor
                  await image
                    .resize({
                      width: device.viewport.width * device.deviceScaleFactor,
                      height: height
                    })
                    .toFile(fileOut)

                  composite.push({
                    input: fileOut,
                    top: topComposite,
                    left: 0
                  })
                  break
              }
              topComposite += height
            }

            await sharp(`blank.png`)
              .resize(
                device.viewport.width * device.deviceScaleFactor,
                scrollHeight * device.deviceScaleFactor
              )
              .composite(composite)
              .toFile(localfilepath)

            await glob('**/tmpshot-*.png', async function(er, files) {
              for (const file of files) {
                await fs.promises.unlink(file)
              }
            })
          } else {
            await puppet.screenshot({
              path: localfilepath,
              fullPage: true
            })
          }

          await puppet.close()

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
  compareReports = async () => {
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
          const currentfilepath = `${this.config.tmpCurrentPath}/${this.dbDevice.slug}/${filename}`
          const filenamediff = `${slugify(page.id)}-diff.${this.config.format}`
          const localfilepathdiff = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filenamediff}`
          let diff = null

          this.printer.compare(`${page.id}`)

          const dbpage = await this.db.createPage(page, this.dbReport)
          let capture = await this.db.getCapture(
            this.dbReport,
            this.dbDevice,
            dbpage
          )

          /** Compare */
          diff = await this.compare.compare(
            localfilepath,
            currentfilepath,
            localfilepathdiff
          )

          if (diff && diff !== 0) {
            capture.diff = true
            capture.diffindex = diff
          } else {
            capture.diff = false
          }

          // if (diff && diff > 0) {
          //   capture.urldiff = await this.store.uploadfile(
          //     `${this.config.date}/${this.dbDevice.slug}/${filenamediff}`,
          //     localfilepathdiff
          //   )
          // }

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
  populateSparklines = async () => {
    this.printer.header(`📷 populateSparklines`)

    let i = 0
    const iMax = this.config.devices.length
    for (; i < iMax; i++) {
      const device = await this.db.getDevice(this.config.devices[i])

      const pages = await this.db.getPages()

      /** Looping through URLs */
      let j = 0
      const jMax = pages.length
      for (; j < jMax; j++) {
        const spark = await this.db.setSparkline(device, pages[j])
      }
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
    device.deviceScaleFactor = device.viewport.deviceScaleFactor

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
