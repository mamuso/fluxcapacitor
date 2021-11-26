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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Capture {
    constructor(config) {
        /**
         *  Logic to capture the list of endpoints.
         */
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`📷 Capture URLs`);
                // Create a new browser instance
                this.browser = yield puppeteer_1.default.launch({
                    headless: true,
                    defaultViewport: null,
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
                });
                // Loop through devices
                for (const deviceConfig of this.config.devices) {
                    const device = yield this.setDevice(deviceConfig);
                    this.printer.subHeader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                }
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  Configure device for capture.
         */
        this.setDevice = (deviceConfig) => __awaiter(this, void 0, void 0, function* () {
            const device = (deviceConfig.device
                ? puppeteer_1.default.devices[deviceConfig.device]
                : deviceConfig);
            device.userAgent = device.userAgent || (yield this.browser.userAgent());
            device.id = deviceConfig.id;
            device.deviceScaleFactor = device.viewport.deviceScaleFactor;
            return device;
        });
        /**
         *  Close sessions.
         */
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            /** Close browser session */
            if (this.browser) {
                yield this.browser.close();
            }
        });
        this.printer = new utils_1.default();
        this.config = Object.assign({}, config);
    }
}
exports.default = Capture;
