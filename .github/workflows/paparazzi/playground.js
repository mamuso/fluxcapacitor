const dotenv = require('dotenv').config()
const azure = require('azure-storage')
const playwright = require('playwright')

let startDate = new Date()
let expiryDate = new Date(startDate)
expiryDate.setMinutes(startDate.getMinutes() + 100)
startDate.setMinutes(startDate.getMinutes() - 100)
const sharedAccessPolicy = {
  AccessPolicy: {
    Permissions: azure.FileUtilities.SharedAccessPermissions.READ,
    Start: startDate,
    Expiry: expiryDate
  }
}

const fileService = azure
  .createFileService()(async function() {
    const browser = await playwright.chromium.launch([])
    const page = await browser.newPage()
    await page.goto('https://github.com/')
    await page.screenshot({path: `test.png`})

    await fileService.createShareIfNotExists('fluxshare', function(
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
    await fileService.createDirectoryIfNotExists(
      'fluxshare',
      'screenshots',
      function(error, result, response) {
        if (!error) {
          console.log(result)
        } else {
          console.log(error)
        }
      }
    )
    await fileService.createFileFromLocalFile(
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
    const token = await fileService.generateSharedAccessSignature(
      'fluxshare',
      'screenshots',
      'test.jpg',
      sharedAccessPolicy
    )
    await fileService.getUrl('fluxshare', 'screenshots', 'test.png', token)

    await console.log(url)
    await browser.close()
  })()
  .catch(e => {
    console.error(e)
  })
