const dotenv = require('dotenv').config()
var azure = require('azure-storage')

var startDate = new Date()
var expiryDate = new Date(startDate)
expiryDate.setMinutes(startDate.getMinutes() + 100)
startDate.setMinutes(startDate.getMinutes() - 100)

var sharedAccessPolicy = {
  AccessPolicy: {
    Permissions: azure.FileUtilities.SharedAccessPermissions.READ,
    Start: startDate,
    Expiry: expiryDate
  }
}

var fileService = azure.createFileService()

fileService.createShareIfNotExists('fluxshare', function(
  error,
  result,
  response
) {
  if (!error) {
    console.log(result)
  } else {
    console.log(error)
  }
})

fileService.createDirectoryIfNotExists('fluxshare', 'screenshots', function(
  error,
  result,
  response
) {
  if (!error) {
    console.log(result)
  } else {
    console.log(error)
  }
})

fileService.createFileFromLocalFile(
  'fluxshare',
  'screenshots',
  'test.png',
  'test.png',
  function(error, result, response) {
    if (!error) {
      console.log(result)
    } else {
      console.log(error)
    }
  }
)

const token = fileService.generateSharedAccessSignature(
  'fluxshare',
  'screenshots',
  'test.png',
  sharedAccessPolicy
)
const url = fileService.getUrl('fluxshare', 'screenshots', 'test.png', token)

console.log(url)
