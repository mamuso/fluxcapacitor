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
        this.getcurrent = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.report.findMany({
                where: {
                    current: true
                }
            });
        });
        /**
         * Sets the new current.
         */
        this.setcurrent = (report) => __awaiter(this, void 0, void 0, function* () {
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
                    current: true
                }
            });
        });
        /**
         * Inserts a report in the database.
         */
        this.createreport = () => __awaiter(this, void 0, void 0, function* () {
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
        this.updatereporturl = (report, url) => __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.report.update({
                where: { id: report.id },
                data: { url: url }
            });
        });
        /**
         * Inserts or updates a device in the database.
         */
        this.createdevice = (device) => __awaiter(this, void 0, void 0, function* () {
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
         * Inserts or updates a page in the database.
         */
        this.createpage = (page, report) => __awaiter(this, void 0, void 0, function* () {
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
            yield this.addpagetoreport(report, p);
            return p;
        });
        /**
         * Inserts or updates a capture in the database.
         */
        this.createcapture = (report, device, page) => __awaiter(this, void 0, void 0, function* () {
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
                    }
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
                    }
                }
            });
        });
        /**
         * Connect pages and reports.
         */
        this.addpagetoreport = (report, page) => __awaiter(this, void 0, void 0, function* () {
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
