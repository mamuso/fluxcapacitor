import {Config, Device, Report, Page, Capture} from './types'
import slugify from '@sindresorhus/slugify'
import {PrismaClient} from '../../../../../node_modules/@prisma/client'

export default class DB {
  config = {} as Config
  prisma = new PrismaClient()

  constructor(config: Config) {
    this.config = {...config}
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
   * Inserts or updates a report in the database.
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
}
