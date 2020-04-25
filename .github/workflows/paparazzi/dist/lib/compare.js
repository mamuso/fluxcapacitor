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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const pngjs = __importStar(require("pngjs"));
const pixelmatch_1 = __importDefault(require("pixelmatch"));
class Compare {
    constructor(config) {
        /**
         * Compress folder.
         */
        this.compare = (capturepath, currentpath, diffpath) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs.existsSync(currentpath)) {
                    return -1;
                }
                const captureimgraw = this.png.sync.read(fs.readFileSync(capturepath));
                const currentimgraw = this.png.sync.read(fs.readFileSync(currentpath));
                const hasSizeMismatch = currentimgraw.height !== captureimgraw.height ||
                    currentimgraw.width !== captureimgraw.width;
                const [captureimg, currentimg] = (yield hasSizeMismatch)
                    ? yield this.alignImagesToSameSize(currentimgraw, captureimgraw)
                    : [currentimgraw, captureimgraw];
                const imageWidth = captureimg.width;
                const imageHeight = captureimg.height;
                const diffImage = new this.png({
                    width: imageWidth,
                    height: imageHeight
                });
                const diffPixelCount = yield pixelmatch_1.default(captureimg.data, currentimg.data, diffImage.data, imageWidth, imageHeight, {
                    threshold: 0.1,
                    diffColor: [235, 76, 137]
                });
                yield fs.writeFileSync(diffpath, this.png.sync.write(diffImage));
                return diffPixelCount;
            }
            catch (e) {
                throw e;
            }
        });
        this.alignImagesToSameSize = (firstImage, secondImage) => __awaiter(this, void 0, void 0, function* () {
            // Keep original sizes to fill extended area later
            const firstImageWidth = firstImage.width;
            const firstImageHeight = firstImage.height;
            const secondImageWidth = secondImage.width;
            const secondImageHeight = secondImage.height;
            // Calculate biggest common values
            const resizeToSameSize = this.createImageResizer(Math.max(firstImageWidth, secondImageWidth), Math.max(firstImageHeight, secondImageHeight));
            // Resize both images
            const resizedFirst = yield resizeToSameSize(firstImage);
            const resizedSecond = yield resizeToSameSize(secondImage);
            // Fill resized area with black transparent pixels
            return [
                this.fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
                this.fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
            ];
        });
        this.createImageResizer = (width, height) => source => {
            const resized = new this.png({ width, height, fill: true });
            this.png.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
            return resized;
        };
        this.fillSizeDifference = (width, height) => image => {
            const inArea = (x, y) => y > height || x > width;
            for (let y = 0; y < image.height; y++) {
                for (let x = 0; x < image.width; x++) {
                    if (inArea(x, y)) {
                        const idx = (image.width * y + x) << 2;
                        image.data[idx] = 0;
                        image.data[idx + 1] = 0;
                        image.data[idx + 2] = 0;
                        image.data[idx + 3] = 64;
                    }
                }
            }
            return image;
        };
        this.config = Object.assign({}, config);
        this.png = pngjs.PNG;
    }
}
exports.default = Compare;
