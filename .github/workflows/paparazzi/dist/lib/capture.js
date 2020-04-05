"use strict";
/* eslint-disable no-console */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
const fs = __importStar(require("fs"));
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Capture {
    constructor(config) {
        this.printer = new utils_1.default();
        this.config = {};
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            this.printer.header(`📷 Capture URLs`);
            /** Looping through devices */
            let i = 0;
            const iMax = this.config.devices.length;
            for (; i < iMax; i++) {
                const captureDevice = this.config.devices[i];
                const browser = yield puppeteer_1.default.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = yield browser.newPage();
                let device = (captureDevice.device
                    ? puppeteer_1.default.devices[captureDevice.device]
                    : captureDevice);
                device.userAgent = device.userAgent || (yield browser.userAgent());
                yield page.emulate(device);
                /** Make device folder */
                if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                    yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                }
                this.printer.subheader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                /** Looping through URLs */
                let j = 0;
                const jMax = this.config.urls.length;
                for (; j < jMax; j++) {
                    const captureData = this.config.urls[j];
                    const fileName = `${slugify_1.default(captureData.id)}.${this.config.format}`;
                    const localFilePath = `${this.config.tmpDatePath}/${device.id}/${fileName}`;
                    yield page.goto(captureData.url);
                    yield page.screenshot({
                        path: localFilePath,
                        fullPage: captureData.fullPage
                    });
                    this.printer.capture(captureData.id);
                }
                yield browser.close();
            }
            // console.log(this.config)
            return true;
        });
        this.config = Object.assign({}, config);
    }
}
exports.default = Capture;
// const puppeteer = require('puppeteer')
// const slugify = require('slugify')
// const utils = require('./utils')
// const screens = []
// module.exports = async ({...config} = {}) => {
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
