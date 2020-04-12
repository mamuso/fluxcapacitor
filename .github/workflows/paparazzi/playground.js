const azure = require('azure-storage')
const blob = azure.createBlobService()

async function asyncCall() {
  const container = blob.createContainerIfNotExists(
    'fluxcontainer',
    {
      publicAccessLevel: 'blob'
    },
    function(error, result, response) {}
  )

  const upload = await blob.createBlockBlobFromLocalFile(
    'fluxcontainer',
    `test/test.jpg`,
    'test.jpg',
    function(error, result, response) {}
  )

  console.log(blob.getUrl('fluxcontainer', 'test/test.jpg'))
}

asyncCall()
