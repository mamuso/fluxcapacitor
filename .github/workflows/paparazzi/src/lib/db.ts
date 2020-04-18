import {Config, Device, Report, Page, CaptureType} from './types'
import slugify from '@sindresorhus/slugify'
import {PrismaClient} from '../../../../../node_modules/@prisma/client'
import Capture from './capture'
import {callbackify} from 'util'

export default class DB {
  config
  prisma

  constructor(config: Config) {
    this.prisma = new PrismaClient()
    this.config = {...config} as Config
  }

  /**
   * Get current.
   */
  getcurrent = async () => {
    return await this.prisma.report.findMany({
      where: {
        current: true
      }
    })
  }

  /**
   * Sets the new current.
   */
  setcurrent = async report => {
    await this.prisma.report.updateMany({
      where: {
        current: true
      },
      data: {
        current: false
      }
    })
    await this.prisma.report.update({
      where: {id: report},
      data: {
        current: true
      }
    })
  }

  /**
   * Inserts a report in the database.
   */
  createreport = async () => {
    return await this.prisma.report.upsert({
      where: {
        slug: `${this.config.date}`
      },
      create: {
        slug: `${this.config.date}`
      },
      update: {
        slug: `${this.config.date}`
      }
    })
  }

  updatereporturl = async (report, url) => {
    await this.prisma.report.update({
      where: {id: report.id},
      data: {url: url}
    })
  }

  /**
   * Inserts or updates a device in the database.
   */
  createdevice = async (device: Device) => {
    const slug = slugify(device.id)
    const name = device.id
    const specs = `${device.viewport.width}x${device.viewport.height} @${device.viewport.deviceScaleFactor}x – ${device.userAgent}`

    return await this.prisma.device.upsert({
      where: {
        slug: slug
      },
      create: {
        slug: slug,
        name: name,
        specs: specs
      },
      update: {
        slug: slug,
        name: name,
        specs: specs
      }
    })
  }

  /**
   * Inserts or updates a page in the database.
   */
  createpage = async (page: Page, report: Report) => {
    const slug = slugify(page.id)
    const url = page.url

    const p = await this.prisma.page.upsert({
      where: {
        slug: slug
      },
      create: {
        slug: slug,
        url: url,
        startsAt: report.slug
      },
      update: {
        slug: slug,
        url: url
      }
    })

    await this.addpagetoreport(report, p)

    return p
  }

  /**
   * Inserts or updates a capture in the database.
   */
  createcapture = async (
    report: Report,
    device: Device,
    page: Page,
    capture: CaptureType
  ) => {
    const slug = slugify(`${report.slug}-${device.slug}-${page.slug}`)

    return await this.prisma.capture.upsert({
      where: {
        slug: slug
      },
      create: {
        slug: slug,
        page: {
          connect: {id: page.id}
        },
        report: {
          connect: {id: report.id}
        },
        device: {
          connect: {id: device.id}
        },
        url: capture.url,
        urlmin: capture.urlmin,
        urldiff: capture.urldiff,
        diff: capture.diff,
        diffindex: capture.diffindex
      },
      update: {
        slug: slug,
        page: {
          connect: {id: page.id}
        },
        report: {
          connect: {id: report.id}
        },
        device: {
          connect: {id: device.id}
        },
        url: capture.url,
        urlmin: capture.urlmin,
        urldiff: capture.urldiff,
        diff: capture.diff,
        diffindex: capture.diffindex
      }
    })
  }

  /**
   * Connect pages and reports.
   */
  addpagetoreport = async (report, page) => {
    /** TODO: I'm sure there is a better way of doing this */
    const r = await this.prisma.report
      .update({
        where: {id: report.id},
        data: {
          pages: {
            connect: {id: page.id}
          }
        }
      })
      .pages()

    await this.prisma.report.update({
      where: {id: report.id},
      data: {
        pagecount: r.length
      }
    })

    const p = await this.prisma.page
      .findOne({
        where: {id: page.id}
      })
      .reports()

    await this.prisma.page.update({
      where: {id: page.id},
      data: {
        reportcount: p.length,
        endsAt: report.slug
      }
    })
  }
}
