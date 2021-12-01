"use strict";
/**
 * Screenshot and store all the things.
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const puppeteer = require("puppeteer");
const utils_1 = require("./utils");
class Capture {
    constructor(config) {
        /**
         *  Logic to capture the list of endpoints.
         */
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`📷 Capture URLs`);
                // Create a new browser instance
                const browser = yield puppeteer.launch({
                    headless: true,
                    defaultViewport: null,
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
                });
                // Loop through devices
                for (const deviceConfig of this.config.devices) {
                    const device = yield this.setDevice(deviceConfig, browser);
                    this.printer.subHeader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                    // Create device folder
                    if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                        yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                    }
                    // Loop through endpoints
                    for (const endpointObject of this.config.endpoints) {
                        const endpoint = endpointObject;
                        yield this.takeScreenshot(endpoint, device);
                    }
                }
                // Close puppeteer browser instance
                browser.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  Take a screenshot and save it.
         */
        this.takeScreenshot = (endpoint, device) => __awaiter(this, void 0, void 0, function* () {
            const filename = `${endpoint.id}.${this.config.format}`;
            // const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
            // const capture = {} as CaptureType;
            this.printer.capture(`${endpoint.id} – ${filename} – ${device.id}`);
        });
        /**
         *  Configure device for capture.
         */
        this.setDevice = (deviceConfig, browser) => __awaiter(this, void 0, void 0, function* () {
            const device = (deviceConfig.device
                ? puppeteer.devices[deviceConfig.device]
                : deviceConfig);
            device.userAgent = device.userAgent || (yield browser.userAgent());
            device.id = deviceConfig.id;
            device.deviceScaleFactor = device.viewport.deviceScaleFactor;
            return device;
        });
        this.printer = new utils_1.Printer();
        this.config = Object.assign({}, config);
    }
}
exports.default = Capture;
