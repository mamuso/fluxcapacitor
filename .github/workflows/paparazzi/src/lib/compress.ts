import {Config} from './types'
import * as tar from 'tar '

export default class Compress {
  config

  constructor(config: Config) {
    this.config = {...config} as Config
  }

  /**
   * Compress folder.
   */
  dir = async (compresspath: string, destination: string) => {
    await compressing.tar.compressDir(compresspath, destination)
  }

  /**
   * Uncompress folder.
   */
  uncompress = async (compresspath: string, destination: string) => {
    await compressing.tar.uncompress(compresspath, destination, {
      strip: 1
    })
  }
}
