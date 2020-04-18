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
const store_1 = __importDefault(require("./store"));
const compare_1 = __importDefault(require("./compare"));
const compress_1 = __importDefault(require("./compress"));
const db_1 = __importDefault(require("./db"));
const fs = __importStar(require("fs"));
const rp = __importStar(require("request-promise"));
const sharp_1 = __importDefault(require("sharp"));
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Capture {
    constructor(config) {
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`📷 Capture URLs`);
                /** Set current and download report */
                yield this.getcurrent();
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
                        /** Setting all the variables */
                        const page = this.config.pages[j];
                        const filename = `${slugify_1.default(page.id)}.${this.config.format}`;
                        const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
                        const currentfilepath = `${this.config.tmpCurrentPath}/${device.id}/${filename}`;
                        const filenamemin = `${slugify_1.default(page.id)}-min.jpg`;
                        const localfilepathmin = `${this.config.tmpDatePath}/${device.id}/${filenamemin}`;
                        const filenamediff = `${slugify_1.default(page.id)}-diff.${this.config.format}`;
                        const localfilepathdiff = `${this.config.tmpDatePath}/${device.id}/${filenamediff}`;
                        const capture = {};
                        yield puppet.goto(page.url);
                        yield puppet.screenshot({
                            path: localfilepath,
                            fullPage: page.fullPage
                        });
                        /** DB page */
                        const dbpage = yield this.db.createpage(page, this.dbreport);
                        capture.page = dbpage.id;
                        /** Resize main image */
                        yield sharp_1.default(localfilepath)
                            .resize({
                            width: 600,
                            height: 800,
                            position: 'top'
                        })
                            .toFile(localfilepathmin);
                        /** Compare */
                        const diff = yield this.compare.compare(localfilepath, currentfilepath, localfilepathdiff);
                        if (diff != 0) {
                            capture.diff = true;
                            capture.diffindex = diff;
                        }
                        else {
                            capture.diff = false;
                        }
                        /** Upload images */
                        capture.url = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filename}`, localfilepath);
                        capture.urlmin = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filenamemin}`, localfilepathmin);
                        if (diff > 0) {
                            capture.urldiff = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filenamediff}`, localfilepathdiff);
                        }
                        capture.slug = slugify_1.default(`${this.dbreport.slug}-${this.dbdevice.slug}-${page.slug}`);
                        /** Write capture in the DB */
                        yield this.db.createcapture(this.dbreport, this.dbdevice, dbpage, capture);
                        /** Print output */
                        this.printer.capture(page.id);
                    }
                    yield browser.close();
                }
                /** Compress folder, upload it, and updates the db */
                this.printer.subheader(`🤐 Zipping screenshots`);
                const zipname = `${this.config.date}.tgz`;
                yield this.compress.dir(this.config.tmpDatePath, `${this.config.tmpPath}/${zipname}`);
                const zipurl = yield this.store.uploadfile(`archive/${zipname}`, `${this.config.tmpPath}/${zipname}`);
                yield this.db.updatereporturl(this.dbreport, zipurl);
                /** Update the current report */
                yield this.db.setcurrent(this.dbreport.id);
                /** Disconnect from the DB */
                yield this.db.prisma.disconnect();
            }
            catch (e) {
                throw e;
            }
        });
        this.getcurrent = () => __awaiter(this, void 0, void 0, function* () {
            const current = yield this.db.getcurrent();
            this.current = current[0] ? current[0] : null;
            if (this.current) {
                const res = yield rp.get({ uri: this.current.url, encoding: null });
                fs.writeFileSync(`${this.config.tmpPath}/current.tgz`, res, {
                    encoding: null
                });
                yield this.compress.extract(`${this.config.tmpPath}/current.tgz`, this.config.tmpCurrentPath);
            }
        });
        this.printer = new utils_1.default();
        this.config = Object.assign({}, config);
        this.compare = new compare_1.default(Object.assign({}, config));
        this.compress = new compress_1.default(Object.assign({}, config));
        this.store = new store_1.default(Object.assign({}, config));
        this.db = new db_1.default(Object.assign({}, config));
    }
}
exports.default = Capture;
