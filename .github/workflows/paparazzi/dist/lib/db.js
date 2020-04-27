"use strict";
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
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const client_1 = require("../../../../../node_modules/@prisma/client");
class DB {
    constructor(config) {
        /**
         * Get current.
         */
        this.getCurrent = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.report.findMany({
                where: {
                    current: true
                },
                include: {
                    captures: true
                }
            });
        });
        /**
         * Sets the new current.
         */
        this.setCurrent = (report) => __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.report.updateMany({
                where: {
                    current: true
                },
                data: {
                    current: false
                }
            });
            yield this.prisma.report.update({
                where: { id: report },
                data: {
                    current: true,
                    visible: true
                }
            });
        });
        /**
         * Inserts a report in the database.
         */
        this.createReport = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.report.upsert({
                where: {
                    slug: `${this.config.date}`
                },
                create: {
                    slug: `${this.config.date}`
                },
                update: {
                    slug: `${this.config.date}`
                }
            });
        });
        /**
         * Inserts or updates a device in the database.
         */
        this.createDevice = (device) => __awaiter(this, void 0, void 0, function* () {
            const slug = slugify_1.default(device.id);
            const name = device.id;
            const specs = `${device.viewport.width}x${device.viewport.height} @${device.viewport.deviceScaleFactor}x – ${device.userAgent}`;
            return yield this.prisma.device.upsert({
                where: {
                    slug: slug
                },
                create: {
                    slug: slug,
                    name: name,
                    deviceScaleFactor: device.viewport.deviceScaleFactor,
                    specs: specs
                },
                update: {
                    slug: slug,
                    name: name,
                    specs: specs
                }
            });
        });
        /**
         * TODO
         */
        this.getDevice = (device) => __awaiter(this, void 0, void 0, function* () {
            const slug = slugify_1.default(device.id);
            return yield this.prisma.device.findOne({
                where: {
                    slug: slug
                }
            });
        });
        /**
         * Inserts or updates a page in the database.
         */
        this.createPage = (page, report) => __awaiter(this, void 0, void 0, function* () {
            const slug = slugify_1.default(page.id);
            const url = page.url;
            const p = yield this.prisma.page.upsert({
                where: {
                    slug: slug
                },
                create: {
                    slug: slug,
                    url: url,
                    startsAt: report.slug
                },
                update: {
                    slug: slug,
                    url: url
                }
            });
            yield this.addPageToReport(report, p);
            return p;
        });
        /**
         * Inserts or updates a capture in the database.
         */
        this.createCapture = (report, device, page, capture) => __awaiter(this, void 0, void 0, function* () {
            const slug = slugify_1.default(`${report.slug}-${device.slug}-${page.slug}`);
            return yield this.prisma.capture.upsert({
                where: {
                    slug: slug
                },
                create: {
                    slug: slug,
                    page: {
                        connect: { id: page.id }
                    },
                    report: {
                        connect: { id: report.id }
                    },
                    device: {
                        connect: { id: device.id }
                    },
                    url: capture.url,
                    urlmin: capture.urlmin,
                    urldiff: capture.urldiff,
                    diff: capture.diff,
                    diffindex: capture.diffindex,
                    deviceScaleFactor: device.deviceScaleFactor
                },
                update: {
                    slug: slug,
                    page: {
                        connect: { id: page.id }
                    },
                    report: {
                        connect: { id: report.id }
                    },
                    device: {
                        connect: { id: device.id }
                    },
                    url: capture.url,
                    urlmin: capture.urlmin,
                    urldiff: capture.urldiff,
                    diff: capture.diff,
                    diffindex: capture.diffindex
                }
            });
        });
        /**
         * TODO.
         */
        this.getCapture = (report, device, page) => __awaiter(this, void 0, void 0, function* () {
            const slug = slugify_1.default(`${report.slug}-${device.slug}-${page.slug}`);
            return yield this.prisma.capture.findOne({
                where: {
                    slug: slug
                }
            });
        });
        /**
         * Connect pages and reports.
         */
        this.addPageToReport = (report, page) => __awaiter(this, void 0, void 0, function* () {
            /** TODO: I'm sure there is a better way of doing this */
            const r = yield this.prisma.report
                .update({
                where: { id: report.id },
                data: {
                    pages: {
                        connect: { id: page.id }
                    }
                }
            })
                .pages();
            yield this.prisma.report.update({
                where: { id: report.id },
                data: {
                    pagecount: r.length
                }
            });
            const p = yield this.prisma.page
                .findOne({
                where: { id: page.id }
            })
                .reports();
            yield this.prisma.page.update({
                where: { id: page.id },
                data: {
                    reportcount: p.length,
                    endsAt: report.slug
                }
            });
        });
        this.prisma = new client_1.PrismaClient();
        this.config = Object.assign({}, config);
    }
}
exports.default = DB;
