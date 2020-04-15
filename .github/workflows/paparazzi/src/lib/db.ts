import {Config, Device, Report, Page} from './types'
import slugify from '@sindresorhus/slugify'
import {PrismaClient} from '../../../../../node_modules/@prisma/client'
import {connect} from 'http2'

export default class DB {
  config = {} as Config
  prisma = new PrismaClient()

  constructor(config: Config) {
    this.config = {...config}
  }

  /**
   * Sets the new current.
   */
  setcurrent = async () => {
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
   * Inserts or updates a report in the database.
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
  createpage = async (page: Page) => {
    const slug = slugify(page.id)
    const url = page.url

    return await this.prisma.page.upsert({
      where: {
        slug: slug
      },
      create: {
        slug: slug,
        url: url
      },
      update: {
        slug: slug,
        url: url
      }
    })
  }

  /**
   * Inserts or updates a capture in the database.
   */
  createcapture = async (report: Report, device: Device, page: Page) => {
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
        }
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
        }
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
        reportcount: p.length
      }
    })

    console.log(p)
  }
}
