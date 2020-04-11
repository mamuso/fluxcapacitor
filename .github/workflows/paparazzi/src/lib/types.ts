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
  captures: [Capture]
}

export type Page = {
  id: string
  slug: string
  url: string
  fullPage: boolean
  captures: [Capture]
  reports: [Report]
}

export type Capture = {
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
