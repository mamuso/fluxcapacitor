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
const store_1 = __importDefault(require("./store"));
const fs = __importStar(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
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
                    const filename = `${slugify_1.default(page.id)}.${this.config.format}`;
                    const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
                    const filenamemin = `${slugify_1.default(page.id)}-min.${this.config.format}`;
                    const localfilepathmin = `${this.config.tmpDatePath}/${device.id}/${filenamemin}`;
                    const filenamediff = `${slugify_1.default(page.id)}-diff.${this.config.format}`;
                    const localfilepathdiff = `${this.config.tmpDatePath}/${device.id}/${filenamediff}`;
                    const capture = {};
                    this.printer.capture(page.id);
                    yield puppet.goto(page.url);
                    yield puppet.screenshot({
                        path: localfilepath,
                        fullPage: page.fullPage
                    });
                    /** DB page */
                    const dbpage = yield this.db.createpage(page);
                    capture.page = dbpage.id;
                    /** Upload main image */
                    capture.url = yield this.store.uploadfile(this.config.date, device.id, filename, localfilepath);
                    /** Resize and upload main image */
                    yield sharp_1.default(localfilepath)
                        .resize({
                        width: 360,
                        height: 360,
                        position: 'top'
                    })
                        .toFile(localfilepathmin);
                    capture.urlmin = yield this.store.uploadfile(this.config.date, device.id, filenamemin, localfilepathmin);
                    capture.slug = slugify_1.default(`${this.dbreport.slug}-${this.dbdevice.slug}-${page.slug}`);
                    // Write capture in the DB
                    // await this.db.createcapture(this.dbreport, this.dbdevice, this.dbpage)
                }
                yield browser.close();
            }
            yield this.db.prisma.disconnect();
            return true;
        });
        this.config = Object.assign({}, config);
        this.db = new db_1.default(Object.assign({}, config));
        this.store = new store_1.default(Object.assign({}, config));
    }
}
exports.default = Capture;
