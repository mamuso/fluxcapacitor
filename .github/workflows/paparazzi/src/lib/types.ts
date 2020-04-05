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
  urls: [Urls]
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

export type Urls = {
  id: string
  url: string
  fullPage: boolean
}
