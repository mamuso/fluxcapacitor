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
/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */
require("./lib/env");
const utils_1 = __importDefault(require("./lib/utils"));
const capture_1 = __importDefault(require("./lib/capture"));
const fs = __importStar(require("fs"));
class Paparazzi {
    constructor(date, basePath, tmpPath = 'tmp') {
        /**
         *  TODO
         */
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.createScaffold();
                this.printer.header(`✨ Setting up the folder structure - ${this.date}`);
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.getCurrent = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`🔍 Checking out the last capture session - ${this.date}`);
                const capture = new capture_1.default(this.config);
                yield capture.getCurrent();
                yield capture.downloadCurrent();
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.setCurrent = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.header(`✨ Updating the current report - ${this.date}`);
                const capture = new capture_1.default(this.config);
                yield capture.setCurrent();
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.subHeader(`🤓 Creating a new caputre session`);
                const capture = new capture_1.default(this.config);
                yield capture.capture();
                yield capture.close();
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
                this.printer.subHeader(`📦 Resize images`);
                const capture = new capture_1.default(this.config);
                yield capture.resize();
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.compare = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.subHeader(`🤔 Compare images`);
                const capture = new capture_1.default(this.config);
                yield capture.compareReports();
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  TODO
         */
        this.sparklines = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.subHeader(`📈 Sparklines`);
                const capture = new capture_1.default(this.config);
                yield capture.populateSparklines();
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        /**
         *  Create the folder structure needed for capturing the screens
         */
        this.createScaffold = () => __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.config.tmpPath)) {
                yield fs.promises.mkdir(this.config.tmpPath);
            }
            if (!fs.existsSync(this.config.tmpDatePath)) {
                yield fs.promises.mkdir(this.config.tmpDatePath);
            }
            if (!fs.existsSync(this.config.tmpCurrentPath)) {
                yield fs.promises.mkdir(this.config.tmpCurrentPath);
            }
        });
        /**
         *  Remove the folder structure needed for capturing the screens
         */
        this.cleanup = () => __awaiter(this, void 0, void 0, function* () {
            yield fs.promises.rmdir(this.config.tmpPath, { recursive: true });
        });
        this.printer = new utils_1.default();
        this.date = date;
        this.basePath = basePath;
        this.config = Object.assign({ date: this.date, basePath: this.basePath, tmpPath: tmpPath, tmpDatePath: `${tmpPath}/${this.date}`, tmpCurrentPath: `${tmpPath}/current` }, require(`${this.basePath}/fluxcapacitor-config`));
    }
}
const paparazzi = new Paparazzi(process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0], // date
'../../../..' // basepath
);
/**
 *  TODO
 */
switch (process.argv[2]) {
    case 'setup': {
        paparazzi.setup();
        break;
    }
    case 'getcurrent': {
        paparazzi.getCurrent();
        break;
    }
    case 'capture': {
        paparazzi.capture();
        break;
    }
    case 'resize': {
        paparazzi.resize();
        break;
    }
    case 'compare': {
        paparazzi.compare();
        break;
    }
    case 'setcurrent': {
        paparazzi.setCurrent();
        break;
    }
    case 'sparklines': {
        paparazzi.sparklines();
        break;
    }
    default: {
        //statements;
        break;
    }
}
