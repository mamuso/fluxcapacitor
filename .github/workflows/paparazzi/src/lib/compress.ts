import {Config} from './types'
import * as tar from 'tar'

export default class Compress {
  config

  constructor(config: Config) {
    this.config = {...config} as Config
  }

  /**
   * Compress folder.
   */
  dir = async (compresspath: string, destination: string) => {
    await tar.c(
      {
        gzip: true,
        file: destination
      },
      [compresspath]
    )
  }

  /**
   * Uncompress folder.
   */
  extract = async (compresspath: string, destination: string) => {
    await tar.x({
      file: compresspath,
      strip: 2,
      cwd: destination
    })
  }
}
