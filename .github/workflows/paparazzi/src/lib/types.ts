export type Config = {
  date: string
  basePath: string
  tmpPath: string
  tmpDatePath: string
  tmpCurrentPath: string
  format: string
  minify: boolean
  compare: boolean
  storage: string
  devices: [Device]
  pages: [Page]
}

export type Device = {
  id: string
  slug: string
  name: string
  device: string
  userAgent: string
  viewport: {
    width: number
    height: number
    deviceScaleFactor: number
  }
}

export type Report = {
  id: string
  slug: string
  url: string
  current: boolean
  pages: [Page]
  captures: [CaptureType]
}

export type Page = {
  id: string
  slug: string
  url: string
  fullPage: boolean
  captures: [CaptureType]
  reports: [Report]
}

export type CaptureType = {
  id: string
  slug: string
  url: string
  urlmin: string
  urldiff: string
  diff: boolean
  page: Page
  pageId: string
  report: Report
  reportId: string
  device: Device
  devideId: string
}
