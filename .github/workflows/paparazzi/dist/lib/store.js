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
const azure = __importStar(require("azure-storage"));
class store {
    constructor(config) {
        this.config = {};
        this.uploadfile = (date, device, filename, filepath) => __awaiter(this, void 0, void 0, function* () {
            const upload = yield this.blob.createBlockBlobFromLocalFile('fluxcontainer', `${date}/${device}/${filename}`, filepath, function (error, result, response) { });
            return yield this.blob.getUrl('fluxcontainer', `${date}/${device}/${filename}`);
        });
        this.config = Object.assign({}, config);
        this.blob = azure.createBlobService();
        this.blob.createContainerIfNotExists('fluxcontainer', {
            publicAccessLevel: 'blob'
        }, function (error, result, response) { });
    }
}
exports.default = store;
