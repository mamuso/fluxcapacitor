import {Config, Device, Report, Page, CaptureType} from './types'
import slugify from '@sindresorhus/slugify'
import {PrismaClient} from '../../../../../node_modules/@prisma/client'

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
  getCurrent = async () => {
    return await this.prisma.report.findMany({
      where: {
        current: true
      },
      include: {
        captures: true
      }
    })
  }

  /**
   * Sets the new current.
   */
  setCurrent = async report => {
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
        current: true,
        visible: true
      }
    })
  }

  /**
   * Inserts a report in the database.
   */
  createReport = async () => {
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

  /**
   * Inserts or updates a device in the database.
   */
  createDevice = async (device: Device) => {
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
        deviceScaleFactor: device.viewport.deviceScaleFactor,
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
   * TODO
   */
  getDevice = async (device: Device) => {
    const slug = slugify(device.id)

    return await this.prisma.device.findOne({
      where: {
        slug: slug
      }
    })
  }

  /**
   * Inserts or updates a page in the database.
   */
  createPage = async (page: Page, report: Report) => {
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

    await this.addPageToReport(report, p)

    return p
  }

  /**
   * Get a page from the database.
   */
  getPage = async (page: Page) => {
    const slug = slugify(page.id)

    const p = await this.prisma.page.findOne({
      where: {
        slug: slug
      }
    })

    return p
  }

  /**
   * Inserts or updates a capture in the database.
   */
  createCapture = async (
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
        diffindex: capture.diffindex,
        deviceScaleFactor: device.deviceScaleFactor
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
   * TODO.
   */
  getCapture = async (report: Report, device: Device, page: Page) => {
    const slug = slugify(`${report.slug}-${device.slug}-${page.slug}`)

    return await this.prisma.capture.findOne({
      where: {
        slug: slug
      }
    })
  }

  /**
   * Connect pages and reports.
   */
  addPageToReport = async (report, page) => {
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

  /**
   * SetSparkline.
   */
  setSparkline = async (device: Device, page: Page) => {
    const slug = slugify(`${device.slug}-${page.slug}`)

    return await this.prisma.sparkline.upsert({
      where: {
        slug: slug
      },
      create: {
        slug: slug,
        device: {
          connect: {id: device.id}
        },
        page: {
          connect: {id: page.id}
        },
        data: {
          set: ['pa', 'ta', 'ta']
        }
      },
      update: {
        data: {
          set: ['pa', 'ta', 'ta']
        }
      }
    })
  }
}
