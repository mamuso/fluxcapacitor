"use strict";
/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("./lib/env");
const capture_1 = __importDefault(require("./lib/capture"));
const utils_1 = __importDefault(require("./lib/utils"));
const fs = __importStar(require("fs"));
class Paparazzi {
    constructor(date, tmpPath = 'tmp') {
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
                yield capture.close();
            }
            catch (e) {
                throw e;
            }
        });
        this.printer = new utils_1.default();
        this.config = Object.assign({ date: date, tmpPath: tmpPath, tmpDatePath: `${tmpPath}/${date}`, tmpCurrentPath: `${tmpPath}/current` }, require(`../../config`));
    }
}
exports.default = Paparazzi;
