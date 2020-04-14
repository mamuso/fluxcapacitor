import {Config} from './types'
import * as azure from 'azure-storage'
export default class Store {
  config = {} as Config
  blob

  constructor(config: Config) {
    this.config = {...config}
    this.blob = azure.createBlobService()
    this.blob.createContainerIfNotExists(
      'fluxcontainer',
      {
        publicAccessLevel: 'blob'
      },
      function(error, result, response) {}
    )
  }

  uploadfile = async (filedest, filepath) => {
    await this.blob.createBlockBlobFromLocalFile(
      'fluxcontainer',
      filedest,
      filepath,
      function(error, result, response) {}
    )
    return await this.blob.getUrl('fluxcontainer', filedest)
  }
}
