"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Printer = void 0;
/**
 * Silly utilities, mostly for logging.
 */
class Printer {
    constructor() {
        this.header = (text) => {
            console.log('');
            console.log('-----------------------------------------------------------------------');
            console.log(`${text}`);
            console.log('-----------------------------------------------------------------------');
        };
        this.subHeader = (text) => {
            console.log('');
            console.log(`${text}`);
            console.log('-----------------------------------------------------------------------');
        };
        this.download = (text) => {
            console.log(`  └ ⬇️  ${text}`);
        };
        this.capture = (text) => {
            console.log(`  └ 🏙  ${text}`);
        };
        this.resize = (text) => {
            console.log(`  └ 🌉  ${text}`);
        };
        this.compare = (text) => {
            console.log(`  └ 🎆  ${text}`);
        };
        this.log = (text) => {
            console.log(`${text}`);
        };
    }
}
exports.Printer = Printer;
