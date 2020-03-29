const dotenv = require('dotenv').config()
const azure = require('azure-storage')
const puppeteer = require('puppeteer')

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

const fileService = azure.createFileService()

async function asyncCall() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.goto('https://elpais.com/')
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
    'test.png',
    sharedAccessPolicy
  )
  await fileService.getUrl('fluxshare', 'screenshots', 'test.png', token)

  await console.log(url)
  await browser.close()
}

asyncCall()
