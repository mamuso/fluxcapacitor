"use strict";
/**
 * Paparazzi:
 * A GitHub action to capture, compare, minify and store screenshots.
 */
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
require("./lib/env");
const utils_1 = __importDefault(require("./lib/utils"));
const capture_1 = __importDefault(require("./lib/capture"));
const fs = __importStar(require("fs"));
const basePath = fs.existsSync('/github/workspace/repo')
    ? '/github/workspace/repo'
    : '../../../..';
const date = new Date().toISOString().split('T')[0];
const tmp = 'tmp';
const config = Object.assign({ date: date, basePath: basePath, tmpPath: tmp, tmpDatePath: `${tmp}/${date}`, tmpCurrentPath: `${tmp}/current` }, require(`${basePath}/timesled-config`));
const printer = new utils_1.default();
const capture = new capture_1.default(config);
function paparazzi() {
    return __awaiter(this, void 0, void 0, function* () {
        printer.header(`✨ Paparazzi - ${date}`);
        /** Create tmp folders */
        // if (!fs.existsSync(config.tmpPath)) {
        //   await fs.promises.mkdir(config.tmpPath)
        // }
        // if (!fs.existsSync(config.tmpDatePath)) {
        //   await fs.promises.mkdir(config.tmpDatePath)
        // }
        // if (!fs.existsSync(config.tmpCurrentPath)) {
        //   await fs.promises.mkdir(config.tmpCurrentPath)
        // }
        /** Capture */
        const screensList = yield capture.capture();
    });
}
paparazzi();
