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
const db_1 = __importDefault(require("./db"));
const fs = __importStar(require("fs"));
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Capture {
    constructor(config) {
        this.printer = new utils_1.default();
        this.config = {};
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            this.printer.header(`📷 Capture URLs`);
            /** DB report */
            this.dbreport = yield this.db.createreport();
            /** Looping through devices */
            let i = 0;
            const iMax = this.config.devices.length;
            for (; i < iMax; i++) {
                /** Configure device */
                const captureDevice = this.config.devices[i];
                const browser = yield puppeteer_1.default.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const puppet = yield browser.newPage();
                let device = (captureDevice.device
                    ? puppeteer_1.default.devices[captureDevice.device]
                    : captureDevice);
                device.userAgent = device.userAgent || (yield browser.userAgent());
                yield puppet.emulate(device);
                this.printer.subheader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                /** Make device folder */
                if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                    yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                }
                /** DB device */
                this.dbdevice = yield this.db.createdevice(device);
                /** Looping through URLs */
                let j = 0;
                const jMax = this.config.pages.length;
                for (; j < jMax; j++) {
                    const page = this.config.pages[j];
                    const fileName = `${slugify_1.default(page.id)}.${this.config.format}`;
                    const localFilePath = `${this.config.tmpDatePath}/${device.id}/${fileName}`;
                    this.dbpage = yield this.db.createpage(page);
                    console.log(this.dbdevice.id);
                    this.printer.capture(page.id);
                    yield puppet.goto(page.url);
                    yield puppet.screenshot({
                        path: localFilePath,
                        fullPage: page.fullPage
                    });
                    // Compare
                    // Resize
                    // Upload
                    // Write capture in the DB
                }
                yield browser.close();
            }
            return true;
        });
        this.config = Object.assign({}, config);
        this.db = new db_1.default(Object.assign({}, config));
    }
}
exports.default = Capture;
