import {Config} from './types'
import * as compressing from 'compressing'

export default class Compress {
  config = {} as Config

  constructor(config: Config) {
    this.config = {...config}
  }

  /**
   * Compress folder.
   */
  dir = async (compresspath: string, destination: string) => {
    await compressing.tgz.compressDir(compresspath, destination)
  }
}
