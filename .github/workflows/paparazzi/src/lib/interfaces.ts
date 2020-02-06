export interface Config {
  date: string
  basePath: string
  tmpPath: string
  tmpDatePath: string
  format: string
  minify: boolean
  compare: boolean
  storage: string
  devices: [Device]
  nodes: [Node]
}

export interface Device {
  id: string
  viewport: {
    width: number
    height: number
    deviceScaleFactor: number
  }
}

export interface Node {
  id: string
  url: string
  fullPage: boolean
}
