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
const notify_1 = __importDefault(require("./notify"));
const db_1 = __importDefault(require("./db"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const rp = __importStar(require("request-promise"));
const sharp_1 = __importDefault(require("sharp"));
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Capture {
    constructor(config) {
        this.captureOLD = () => __awaiter(this, void 0, void 0, function* () {
            try {
                /** Set current and download report */
                this.printer.subHeader(`🔍 Checking out the last capture session`);
                yield this.getcurrent();
                /** DB report */
                this.printer.subHeader(`🤓 Creating a new caputre session`);
                this.dbReport = yield this.db.createReport();
                this.printer.header(`📷 Capture URLs`);
                const browser = yield puppeteer_1.default.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                /** Looping through devices */
                let i = 0;
                const iMax = this.config.devices.length;
                for (; i < iMax; i++) {
                    /** Configure device */
                    const captureDevice = this.config.devices[i];
                    const puppet = yield browser.newPage();
                    let device = (captureDevice.device
                        ? puppeteer_1.default.devices[captureDevice.device]
                        : captureDevice);
                    device.userAgent = device.userAgent || (yield browser.userAgent());
                    device.id = captureDevice.id;
                    yield puppet.emulate(device);
                    this.printer.subHeader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                    /** Make device folder */
                    if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                        yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                    }
                    /** DB device */
                    this.dbDevice = yield this.db.createDevice(device);
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
                        let diff = null;
                        if (page.auth) {
                            if (this.config.auth.cookie) {
                                yield puppet.setCookie({
                                    value: 'yes',
                                    domain: `${process.env.FLUX_DOMAIN}`,
                                    expires: Date.now() / 1000 + 100,
                                    name: 'logged_in'
                                });
                                yield puppet.setCookie({
                                    value: `${process.env.FLUX_COOKIE}`,
                                    domain: `${process.env.FLUX_DOMAIN}`,
                                    expires: Date.now() / 1000 + 100,
                                    name: 'user_session'
                                });
                            }
                            else {
                                yield puppet.goto(this.config.auth.url, {
                                    waitUntil: 'load'
                                });
                                // Login
                                yield puppet.type(this.config.auth.username, `${process.env.FLUX_LOGIN}`);
                                yield puppet.type(this.config.auth.password, `${process.env.FLUX_PASSWORD}`);
                                yield puppet.click(this.config.auth.submit);
                            }
                        }
                        yield puppet.goto(page.url, { waitUntil: 'load' });
                        // Scrolling through the page
                        const vheight = yield puppet.viewport().height;
                        const pheight = yield puppet.evaluate(_ => {
                            return document.body.scrollHeight;
                        });
                        let v;
                        while (v + vheight < pheight) {
                            yield puppet.evaluate(_ => {
                                window.scrollBy(0, v);
                            });
                            yield puppet.waitFor(350);
                            v = v + vheight;
                        }
                        yield puppet.waitFor(800);
                        yield puppet.screenshot({
                            path: localfilepath,
                            fullPage: page.fullPage
                        });
                        /** DB page */
                        const dbpage = yield this.db.createPage(page, this.dbReport);
                        capture.page = dbpage.id;
                        if (this.current) {
                            const currentpath = `${this.config.tmpCurrentPath}/${device.id}`;
                            if (!fs.existsSync(currentpath)) {
                                yield fs.promises.mkdir(currentpath);
                            }
                            const currentcapture = yield this.db.getcurrentcapture(dbpage, this.current, this.dbDevice);
                            if (currentcapture[0] && currentcapture[0].url) {
                                const res = yield rp.get({
                                    uri: currentcapture[0].url,
                                    encoding: null
                                });
                                fs.writeFileSync(`${currentfilepath}`, res, {
                                    encoding: null
                                });
                            }
                            /** Compare */
                            diff = yield this.compare.compare(localfilepath, currentfilepath, localfilepathdiff);
                        }
                        if (diff && diff !== 0) {
                            capture.diff = true;
                            capture.diffindex = diff;
                        }
                        else {
                            capture.diff = false;
                        }
                        /** Resize main image */
                        yield sharp_1.default(localfilepath)
                            .resize({
                            width: 800,
                            height: 600,
                            position: sharp_1.default.position.top,
                            withoutEnlargement: true
                        })
                            .toFile(localfilepathmin);
                        /** Upload images */
                        capture.url = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filename}`, localfilepath);
                        capture.urlmin = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filenamemin}`, localfilepathmin);
                        if (diff && diff > 0) {
                            capture.urldiff = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filenamediff}`, localfilepathdiff);
                        }
                        capture.slug = slugify_1.default(`${this.dbReport.slug}-${this.dbDevice.slug}-${page.slug}`);
                        /** Write capture in the DB */
                        yield this.db.createCapture(this.dbReport, this.dbDevice, dbpage, capture);
                        /** Print output */
                        this.printer.capture(page.id);
                    }
                    yield browser.close();
                }
                /** Compress folder, upload it, and updates the db */
                // this.printer.subHeader(`🤐 Zipping screenshots`)
                // const zipname = `${this.config.date}.tgz`
                // await this.compress.dir(
                //   this.config.tmpDatePath,
                //   `${this.config.tmpPath}/${zipname}`
                // )
                // const zipurl = await this.store.uploadfile(
                //   `archive/${zipname}`,
                //   `${this.config.tmpPath}/${zipname}`
                // )
                // await this.db.updatereporturl(this.dbReport, zipurl)
                /** Update the current report */
                yield this.db.setcurrent(this.dbReport.id);
                // await this.notify.send()
                /** Disconnect from the DB */
                yield this.db.prisma.disconnect();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.getcurrent = () => __awaiter(this, void 0, void 0, function* () {
            const currentdb = yield this.db.getcurrent();
            this.current = currentdb[0] ? currentdb[0] : null;
        });
        /**
         *  TODO
         */
        this.downloadcurrent = () => __awaiter(this, void 0, void 0, function* () {
            yield this.current.captures.forEach((capture) => __awaiter(this, void 0, void 0, function* () {
                const filepath = capture.url.split(this.current.slug)[1];
                const currentpath = `${this.config.tmpCurrentPath}${filepath}`;
                this.printer.download(filepath);
                if (!fs.existsSync(path.dirname(currentpath))) {
                    fs.mkdirSync(path.dirname(currentpath));
                }
                const res = yield rp.get({
                    uri: capture.url,
                    encoding: null
                });
                yield fs.promises.writeFile(currentpath, res, {
                    encoding: null
                });
            }));
        });
        /**
         *  TODO
         */
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`📷 Capture URLs`);
                this.dbReport = yield this.db.createReport();
                this.browser = yield puppeteer_1.default.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                /** Looping through devices */
                let i = 0;
                const iMax = this.config.devices.length;
                for (; i < iMax; i++) {
                    const captureDevice = this.config.devices[i];
                    const puppet = yield this.browser.newPage();
                    let device = (captureDevice.device
                        ? puppeteer_1.default.devices[captureDevice.device]
                        : captureDevice);
                    device.userAgent = device.userAgent || (yield this.browser.userAgent());
                    device.id = captureDevice.id;
                    yield puppet.emulate(device);
                    this.printer.subHeader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                    /** Make device folder */
                    if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                        yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                    }
                    /** DB device */
                    this.dbDevice = yield this.db.createDevice(device);
                    /** Looping through URLs */
                    let j = 0;
                    const jMax = this.config.pages.length;
                    for (; j < jMax; j++) {
                        const page = this.config.pages[j];
                        const filename = `${slugify_1.default(page.id)}.${this.config.format}`;
                        const localfilepath = `${this.config.tmpDatePath}/${device.id}/${filename}`;
                        const capture = {};
                        this.printer.capture(`Capturing ${page.id}`);
                        /** Authenticating if needed */
                        if (page.auth) {
                            if (this.config.auth.cookie) {
                                yield puppet.setCookie({
                                    value: 'yes',
                                    domain: `${process.env.FLUX_DOMAIN}`,
                                    expires: Date.now() / 1000 + 100,
                                    name: 'logged_in'
                                });
                                yield puppet.setCookie({
                                    value: `${process.env.FLUX_COOKIE}`,
                                    domain: `${process.env.FLUX_DOMAIN}`,
                                    expires: Date.now() / 1000 + 100,
                                    name: 'user_session'
                                });
                            }
                            else {
                                yield puppet.goto(this.config.auth.url, {
                                    waitUntil: 'load'
                                });
                                // Login
                                yield puppet.type(this.config.auth.username, `${process.env.FLUX_LOGIN}`);
                                yield puppet.type(this.config.auth.password, `${process.env.FLUX_PASSWORD}`);
                                yield puppet.click(this.config.auth.submit);
                            }
                        }
                        yield puppet.goto(page.url, { waitUntil: 'load' });
                        // Scrolling through the page
                        const vheight = yield puppet.viewport().height;
                        const pheight = yield puppet.evaluate(_ => {
                            return document.body.scrollHeight;
                        });
                        let v;
                        while (v + vheight < pheight) {
                            yield puppet.evaluate(_ => {
                                window.scrollBy(0, v);
                            });
                            yield puppet.waitFor(150);
                            v = v + vheight;
                        }
                        yield puppet.waitFor(500);
                        yield puppet.screenshot({
                            path: localfilepath,
                            fullPage: page.fullPage
                        });
                        /** DB page */
                        const dbpage = yield this.db.createPage(page, this.dbReport);
                        capture.page = dbpage.id;
                        /** Upload images */
                        capture.url = yield this.store.uploadfile(`${this.config.date}/${device.id}/${filename}`, localfilepath);
                        /** Write capture in the DB */
                        yield this.db.createCapture(this.dbReport, this.dbDevice, dbpage, capture);
                    }
                }
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            /** Close browser session */
            if (this.browser) {
                yield this.browser.close();
            }
            if (this.db.prisma) {
                /** Disconnect from the DB */
                yield this.db.prisma.disconnect();
            }
        });
        this.printer = new utils_1.default();
        this.config = Object.assign({}, config);
        this.compare = new compare_1.default(Object.assign({}, config));
        this.compress = new compress_1.default(Object.assign({}, config));
        this.store = new store_1.default(Object.assign({}, config));
        this.db = new db_1.default(Object.assign({}, config));
        this.notify = new notify_1.default(Object.assign({}, config));
    }
}
exports.default = Capture;
