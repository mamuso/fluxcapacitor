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
const client_1 = require("../../../../../node_modules/@prisma/client");
class Capture {
    constructor(config) {
        this.printer = new utils_1.default();
        this.config = {};
        this.prisma = new client_1.PrismaClient();
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
                this.printer.subheader(`🖥  ${device.id} (${device.viewport.width}x${device.viewport.height})`);
                yield page.emulate(device);
                /** Make device folder */
                if (!fs.existsSync(`${this.config.tmpDatePath}/${device.id}`)) {
                    yield fs.promises.mkdir(`${this.config.tmpDatePath}/${device.id}`);
                }
                /** Looping through URLs */
                let j = 0;
                const jMax = this.config.urls.length;
                for (; j < jMax; j++) {
                    const captureData = this.config.urls[j];
                    const fileName = `${slugify_1.default(captureData.id)}.${this.config.format}`;
                    const localFilePath = `${this.config.tmpDatePath}/${device.id}/${fileName}`;
                    this.printer.capture(captureData.id);
                    yield page.goto(captureData.url);
                    yield page.screenshot({
                        path: localFilePath,
                        fullPage: captureData.fullPage
                    });
                    // Compare
                    // Resize
                    // Upload
                    // Write DB
                    yield this.prisma.captures.create({
                        data: {
                            slug: slugify_1.default(captureData.id),
                            device: slugify_1.default(device.id)
                        }
                    });
                }
                yield browser.close();
            }
            return true;
        });
        this.config = Object.assign({}, config);
    }
}
exports.default = Capture;
