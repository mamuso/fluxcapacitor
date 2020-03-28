"use strict";
/**
 * Capture a list of urls with puppeteer.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {Config} from './types'
const utils_1 = __importDefault(require("./utils"));
const playwright_1 = require("playwright");
class Capture {
    constructor() {
        this.printer = new utils_1.default();
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            const browser = yield playwright_1.chromium.launch({
                args: ['--disable-dev-shm-usage']
            });
            const context = yield browser.newContext();
            const page = yield context.newPage('https://elpais.com/');
            yield page.screenshot({
                path: `example.png`
            });
            yield browser.close();
            return true;
        });
    }
}
exports.default = Capture;
// const puppeteer = require('puppeteer')
// const slugify = require('slugify')
// const utils = require('./utils')
// const screens = []
// module.exports = async ({...config} = {}) => {
//   utils.logHeader(`📷 Capture URLs`)
//   /** Looping through devices */
//   let i = 0
//   const iMax = config.devices.length
//   for (; i < iMax; i++) {
//     const captureDevice = config.devices[i]
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     })
//     const page = await browser.newPage()
//     let device = captureDevice.device
//       ? puppeteer.devices[captureDevice.device]
//       : captureDevice
//     device.userAgent = device.userAgent || (await browser.userAgent())
//     await page.emulate(device)
//     utils.logSubheader(
//       `🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`
//     )
//     /** Looping through URLs */
//     let j = 0
//     const jMax = config.urls.length
//     for (; j < jMax; j++) {
//       const captureData = config.urls[j]
//       const fileName = `${captureDevice.id}-${slugify(captureData.id)}.${
//         config.format
//       }`
//       const localFilePath = `${config.tmpDatePath}/${fileName}`
//       await page.goto(captureData.url)
//       await page.screenshot({
//         path: localFilePath,
//         fullPage: captureData.fullPage
//       })
//       await screens.push({
//         id: `${captureDevice.id}-${slugify(captureData.id)}`,
//         screenId: captureData.id,
//         screenIdSlug: slugify(captureData.id),
//         screenName: fileName,
//         screenPath: localFilePath,
//         diff: false
//       })
//       utils.logCaptureURL(captureData.id)
//     }
//     await browser.close()
//   }
//   return screens
// }
