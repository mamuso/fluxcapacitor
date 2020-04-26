"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.subheader = (text) => {
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
        this.compare = (text) => {
            console.log(`  └ 🎆  ${text}`);
        };
    }
}
exports.default = Printer;
