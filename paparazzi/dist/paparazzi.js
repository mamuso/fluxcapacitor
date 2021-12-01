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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paparazzi = void 0;
require("./lib/env");
const fs = require("fs");
const capture_1 = require("./lib/capture");
const utils_1 = require("./lib/utils");
class Paparazzi {
    /**
     * Handles the capture, storage and notification of a list of URLs.
     *
     * @param date - The day of the capture. Format: YYYY-MM-DD
     * @param configFile - Location of the config.json file. Default: ../../config
     * @returns A report of the capture.
     *
     */
    constructor(date, configFile = '../../config', tmpPath = 'tmp') {
        this.date = date;
        this.configFile = configFile;
        this.tmpPath = tmpPath;
        /**
         *  Run all the tasks needed to kick off the process
         */
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
            this.createScaffold();
            this.printer.header(`✨ Setting up the folder structure - ${this.config.date}`);
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
        /**
         *  Capture screenshots of all the endpoints in the config file
         */
        this.capture = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.printer.subHeader(`🤓 Creating a new caputre session`);
                const capture = new capture_1.default(this.config);
                yield capture.capture();
            }
            catch (e) {
                throw e;
            }
        });
        this.printer = new utils_1.Printer();
        this.config = Object.assign({ date: date, tmpPath: tmpPath, tmpDatePath: `${tmpPath}/${date}`, tmpCurrentPath: `${tmpPath}/current` }, require(configFile));
    }
}
exports.Paparazzi = Paparazzi;
