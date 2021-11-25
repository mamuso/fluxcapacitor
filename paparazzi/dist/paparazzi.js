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
Object.defineProperty(exports, "__esModule", { value: true });
require("./lib/env");
const utils_1 = __importDefault(require("./lib/utils"));
class Paparazzi {
    constructor(date) {
        // Run all the tasks needed to kick off the process.
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
         *  Create the folder structure needed for capturing the screens
         */
        this.createScaffold = () => __awaiter(this, void 0, void 0, function* () { });
        this.printer = new utils_1.default();
        this.config = {
            date: this.date,
        };
    }
}
const paparazzi = new Paparazzi(process.env.TIME ? process.env.TIME : new Date().toISOString().split('T')[0] // date
);
// Switch logic
switch (process.argv[2]) {
    case 'setup': {
        paparazzi.setup();
        break;
    }
    default: {
        break;
    }
}
