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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Screenshot and store all the things.
 */
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
                // Loop through devices
                for (const deviceConfig of this.config.devices) {
                    // Create a new browser instance
                    const browser = yield puppeteer.launch({
                        headless: true,
                        defaultViewport: null,
                        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
                    });
                    const device = yield this.setDevice(deviceConfig, browser);
                    this.printer.subHeader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                    // Create device folder
                    if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                        yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                    }
                    // Loop through endpoints
                    for (const endpointObject of this.config.endpoints) {
                        const endpoint = endpointObject;
                        yield this.takeScreenshot(endpoint, device, browser);
                    }
                    // Close puppeteer browser instance
                    yield browser.close();
                }
            }
            catch (e) {
                throw e;
            }
        });
        /**
         * Take a screenshot and save it.
         *
         * @param endpoint - URL to capture
         * @param device - Device configuration object
         * @param browser - Puppeteer browser instance
         * @returns Promise
         *
         */
        this.takeScreenshot = (endpoint, device, browser) => __awaiter(this, void 0, void 0, function* () {
            const filename = `${(0, utils_1.slugify)(endpoint.id)}.${this.config.format}`;
            const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
            this.printer.capture(`${endpoint.id} – ${filename} – ${device.id}`);
            // Set up the device emulation
            const puppet = yield browser.newPage();
            yield puppet.emulate(device);
            // TODO: Add auth
            yield puppet.goto(endpoint.url, {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });
            // Speed up animations
            const client = yield puppet
                .target()
                .createCDPSession();
            yield client.send('Animation.setPlaybackRate', {
                playbackRate: 2,
            });
            // Check scroll height
            /* istanbul ignore next */
            const scrollHeight = yield puppet.evaluate((_) => {
                return document.body.scrollHeight;
            });
            // Let's wait before the first shot
            yield puppet.waitForTimeout(400);
            // Scroll to the bottom
            if (scrollHeight > 2 * device.viewport.height) {
                let s = 0;
                let scrollTo = 0;
                const safeSpace = 400;
                // Leaving a few pixels between snapshots to stich free of sticky headers
                const scrollSafe = device.viewport.height - safeSpace;
                while (scrollTo <= scrollHeight) {
                    /* istanbul ignore next */
                    yield puppet.evaluate(({ scrollTo }) => {
                        window.scrollTo(0, scrollTo);
                    }, { scrollTo });
                    yield puppet.waitForTimeout(400);
                    const buffer = yield puppet.screenshot({
                        fullPage: false,
                    });
                    yield fs.promises.writeFile(`${this.config.tmpDatePath}/tmpshot-${s}.png`, buffer, {
                        encoding: null,
                    });
                    s += 1;
                    scrollTo += scrollSafe;
                }
            }
            const test = {};
            console.log(test);
            console.log(scrollHeight);
            console.log(localfilepath);
        });
        /**
         *  Configure device for capture.
         *
         * @param device - Device configuration object
         * @param browser - Puppeteer browser instance
         * @returns Puppeteer device instance
         *
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
