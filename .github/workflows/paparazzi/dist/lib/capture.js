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
        /**
         *  TODO
         */
        this.getCurrent = () => __awaiter(this, void 0, void 0, function* () {
            const currentdb = yield this.db.getCurrent();
            this.current = currentdb[0] ? currentdb[0] : null;
        });
        /**
         *  TODO
         */
        this.setCurrent = () => __awaiter(this, void 0, void 0, function* () {
            this.dbReport = yield this.db.createReport();
            yield this.db.setCurrent(this.dbReport.id);
        });
        /**
         *  TODO
         */
        this.downloadCurrent = () => __awaiter(this, void 0, void 0, function* () {
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
                    const device = yield this.setDevice(this.config.devices[i]);
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
                        const puppet = yield this.browser.newPage();
                        yield puppet.emulate(device);
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
                        puppet.close();
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
        this.resize = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.dbReport = yield this.db.createReport();
                let i = 0;
                const iMax = this.config.devices.length;
                for (; i < iMax; i++) {
                    /** DB device */
                    this.dbDevice = yield this.db.getDevice(this.config.devices[i]);
                    this.printer.subHeader(`🖥  ${this.dbDevice.slug}`);
                    /** Looping through URLs */
                    let j = 0;
                    const jMax = this.config.pages.length;
                    for (; j < jMax; j++) {
                        const page = this.config.pages[j];
                        const filename = `${slugify_1.default(page.id)}.${this.config.format}`;
                        const localfilepath = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filename}`;
                        const filenamemin = `${slugify_1.default(page.id)}-min.jpg`;
                        const localfilepathmin = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filenamemin}`;
                        this.printer.resize(`Resizing ${page.id}`);
                        const dbpage = yield this.db.createPage(page, this.dbReport);
                        const capture = yield this.db.getCapture(this.dbReport, this.dbDevice, dbpage);
                        /** Resize captured image */
                        yield sharp_1.default(localfilepath)
                            .resize({
                            width: 800,
                            height: 600,
                            position: sharp_1.default.position.top,
                            withoutEnlargement: true
                        })
                            .toFile(localfilepathmin);
                        capture.urlmin = yield this.store.uploadfile(`${this.config.date}/${this.dbDevice.slug}/${filenamemin}`, localfilepathmin);
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
        this.compareReports = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.dbReport = yield this.db.createReport();
                let i = 0;
                const iMax = this.config.devices.length;
                for (; i < iMax; i++) {
                    /** DB device */
                    this.dbDevice = yield this.db.getDevice(this.config.devices[i]);
                    this.printer.subHeader(`🖥  ${this.dbDevice.slug}`);
                    /** Looping through URLs */
                    let j = 0;
                    const jMax = this.config.pages.length;
                    for (; j < jMax; j++) {
                        const page = this.config.pages[j];
                        const filename = `${slugify_1.default(page.id)}.${this.config.format}`;
                        const localfilepath = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filename}`;
                        const currentfilepath = `${this.config.tmpCurrentPath}/${this.dbDevice.slug}/${filename}`;
                        const filenamediff = `${slugify_1.default(page.id)}-diff.${this.config.format}`;
                        const localfilepathdiff = `${this.config.tmpDatePath}/${this.dbDevice.slug}/${filenamediff}`;
                        let diff = null;
                        this.printer.compare(`${page.id}`);
                        const dbpage = yield this.db.createPage(page, this.dbReport);
                        let capture = yield this.db.getCapture(this.dbReport, this.dbDevice, dbpage);
                        /** Compare */
                        diff = yield this.compare.compare(localfilepath, currentfilepath, localfilepathdiff);
                        if (diff && diff !== 0) {
                            capture.diff = true;
                            capture.diffindex = diff;
                        }
                        else {
                            capture.diff = false;
                        }
                        if (diff && diff > 0) {
                            capture.urldiff = yield this.store.uploadfile(`${this.config.date}/${this.dbDevice.slug}/${filenamediff}`, localfilepathdiff);
                        }
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
        this.setDevice = (configdevice) => __awaiter(this, void 0, void 0, function* () {
            let device = (configdevice.device
                ? puppeteer_1.default.devices[configdevice.device]
                : configdevice);
            device.userAgent = device.userAgent || (yield this.browser.userAgent());
            device.id = configdevice.id;
            device.deviceScaleFactor = device.viewport.deviceScaleFactor;
            return device;
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
