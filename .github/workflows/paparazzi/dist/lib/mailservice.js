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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendGrid = __importStar(require("@sendgrid/mail"));
class MailService {
    constructor(config) {
        this.apikey = process.env.SENDGRID_API_KEY;
        /**
         * Compress folder.
         */
        this.send = (capturepath) => __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = {
                    to: 'mamuso@mamuso.net',
                    from: 'mamuso@github.com',
                    subject: 'Sending with Twilio SendGrid is Fun',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
                };
                SendGrid.send(msg);
            }
            catch (e) {
                throw e;
            }
        });
        this.config = Object.assign({}, config);
        SendGrid.setApiKey(this.apikey);
    }
}
exports.default = MailService;
