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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var sharp_1 = require("sharp");
var utils_1 = require("./utils");
var ScreenshotService = /** @class */ (function () {
    function ScreenshotService(page, selectorMap, verbose, externalLogger, isDebugEnabled) {
        if (isDebugEnabled === void 0) { isDebugEnabled = false; }
        this.annotationBoxes = [];
        this.numberPositions = [];
        this.page = page;
        this.selectorMap = selectorMap;
        this.isDebugEnabled = isDebugEnabled;
        this.verbose = verbose;
        this.externalLogger = externalLogger;
    }
    ScreenshotService.prototype.log = function (logLine) {
        if (this.verbose >= logLine.level) {
            console.log((0, utils_1.logLineToString)(logLine));
        }
        if (this.externalLogger) {
            this.externalLogger(logLine);
        }
    };
    ScreenshotService.prototype.getScreenshot = function (fullpage, quality) {
        if (fullpage === void 0) { fullpage = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (quality && (quality < 0 || quality > 100)) {
                            throw new Error("quality must be between 0 and 100");
                        }
                        return [4 /*yield*/, this.page.screenshot({
                                fullPage: fullpage,
                                quality: quality,
                                type: "jpeg",
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScreenshotService.prototype.getScreenshotPixelCount = function (screenshot) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var image, metadata, pixelCount;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        image = (0, sharp_1.default)(screenshot);
                        return [4 /*yield*/, image.metadata()];
                    case 1:
                        metadata = _e.sent();
                        if (!metadata.width || !metadata.height) {
                            this.log({
                                category: "screenshotService",
                                message: "Unable to determine image dimensions.",
                                level: 0,
                                auxiliary: {
                                    width: {
                                        value: (_b = (_a = metadata.width) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "undefined",
                                        type: "string", // might be undefined
                                    },
                                    height: {
                                        value: (_d = (_c = metadata.height) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "undefined",
                                        type: "string", // might be undefined
                                    },
                                },
                            });
                            throw new Error("Unable to determine image dimensions.");
                        }
                        pixelCount = metadata.width * metadata.height;
                        this.log({
                            category: "screenshotService",
                            message: "got screenshot pixel count",
                            level: 1,
                            auxiliary: {
                                pixelCount: {
                                    value: pixelCount.toString(),
                                    type: "integer",
                                },
                            },
                        });
                        return [2 /*return*/, pixelCount];
                }
            });
        });
    };
    ScreenshotService.prototype.getAnnotatedScreenshot = function (fullpage) {
        return __awaiter(this, void 0, void 0, function () {
            var screenshot, image, _a, width, height, svgAnnotations, scrollPosition, svg, annotatedScreenshot;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.annotationBoxes = [];
                        this.numberPositions = [];
                        return [4 /*yield*/, this.getScreenshot(fullpage)];
                    case 1:
                        screenshot = _b.sent();
                        image = (0, sharp_1.default)(screenshot);
                        return [4 /*yield*/, image.metadata()];
                    case 2:
                        _a = _b.sent(), width = _a.width, height = _a.height;
                        this.log({
                            category: "screenshotService",
                            message: "annotating screenshot",
                            level: 2,
                            auxiliary: {
                                selectorMap: {
                                    value: JSON.stringify(this.selectorMap),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, Promise.all(Object.entries(this.selectorMap).map(function (_a) {
                                var id = _a[0], selectors = _a[1];
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_b) {
                                        return [2 /*return*/, this.createElementAnnotation(id, selectors).catch(function (error) {
                                                _this.log({
                                                    category: "screenshotService",
                                                    message: "warning: failed to create screenshot annotation for element",
                                                    level: 2,
                                                    auxiliary: {
                                                        message: {
                                                            value: error.message,
                                                            type: "string",
                                                        },
                                                        trace: {
                                                            value: error.stack,
                                                            type: "string",
                                                        },
                                                    },
                                                });
                                            })];
                                    });
                                });
                            }))];
                    case 3:
                        svgAnnotations = (_b.sent()).filter(function (annotation) { return annotation !== null; });
                        return [4 /*yield*/, this.page.evaluate(function () {
                                return {
                                    scrollX: window.scrollX,
                                    scrollY: window.scrollY,
                                };
                            })];
                    case 4:
                        scrollPosition = _b.sent();
                        svg = "\n      <svg width=\"".concat(width, "\" height=\"").concat(height, "\" xmlns=\"http://www.w3.org/2000/svg\" style=\"position:absolute;left:").concat(-scrollPosition.scrollX, "px;top:").concat(-scrollPosition.scrollY, "px;\">\n        ").concat(svgAnnotations.join(""), "\n      </svg>\n    ");
                        return [4 /*yield*/, image
                                .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
                                .toBuffer()];
                    case 5:
                        annotatedScreenshot = _b.sent();
                        if (!this.isDebugEnabled) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.saveAndOpenScreenshot(annotatedScreenshot)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, annotatedScreenshot];
                }
            });
        });
    };
    ScreenshotService.prototype.createElementAnnotation = function (id, selectors) {
        return __awaiter(this, void 0, void 0, function () {
            var element_1, selectorPromises, boxes, box, scrollPosition, adjustedBox, numberPosition, circleRadius, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        element_1 = null;
                        selectorPromises = selectors.map(function (selector) { return __awaiter(_this, void 0, void 0, function () {
                            var box_1, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, this.page.locator("xpath=".concat(selector)).first()];
                                    case 1:
                                        element_1 = _b.sent();
                                        return [4 /*yield*/, element_1.boundingBox({ timeout: 5000 })];
                                    case 2:
                                        box_1 = _b.sent();
                                        return [2 /*return*/, box_1];
                                    case 3:
                                        _a = _b.sent();
                                        return [2 /*return*/, null];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(selectorPromises)];
                    case 1:
                        boxes = _a.sent();
                        box = boxes.find(function (b) { return b !== null; });
                        if (!box) {
                            throw new Error("Unable to create annotation for element ".concat(id));
                        }
                        return [4 /*yield*/, this.page.evaluate(function () { return ({
                                scrollX: window.scrollX,
                                scrollY: window.scrollY,
                            }); })];
                    case 2:
                        scrollPosition = _a.sent();
                        adjustedBox = {
                            x: box.x + scrollPosition.scrollX,
                            y: box.y + scrollPosition.scrollY,
                            width: box.width,
                            height: box.height,
                            id: id,
                        };
                        this.annotationBoxes.push(adjustedBox);
                        numberPosition = this.findNonOverlappingNumberPosition(adjustedBox);
                        circleRadius = 12;
                        return [2 /*return*/, "\n        <rect x=\"".concat(adjustedBox.x, "\" y=\"").concat(adjustedBox.y, "\" width=\"").concat(adjustedBox.width, "\" height=\"").concat(adjustedBox.height, "\" \n              fill=\"none\" stroke=\"red\" stroke-width=\"2\" />\n        <circle cx=\"").concat(numberPosition.x, "\" cy=\"").concat(numberPosition.y, "\" r=\"").concat(circleRadius, "\" fill=\"white\" stroke=\"red\" stroke-width=\"2\" />\n        <text x=\"").concat(numberPosition.x, "\" y=\"").concat(numberPosition.y, "\" fill=\"red\" font-size=\"16\" font-weight=\"bold\" \n              text-anchor=\"middle\" dominant-baseline=\"central\">\n          ").concat(id, "\n        </text>\n      ")];
                    case 3:
                        error_1 = _a.sent();
                        this.log({
                            category: "screenshotService",
                            message: "warning: failed to create annotation for element",
                            level: 1,
                            auxiliary: {
                                element_id: {
                                    value: id,
                                    type: "string",
                                },
                                error: {
                                    value: error_1.message,
                                    type: "string",
                                },
                                trace: {
                                    value: error_1.stack,
                                    type: "string",
                                },
                            },
                        });
                        return [2 /*return*/, ""];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ScreenshotService.prototype.findNonOverlappingNumberPosition = function (box) {
        var circleRadius = 12;
        var position = {
            x: box.x - circleRadius,
            y: box.y - circleRadius,
        };
        var attempts = 0;
        var maxAttempts = 10;
        var offset = 5;
        while (this.isNumberOverlapping(position) && attempts < maxAttempts) {
            position.y += offset;
            attempts++;
        }
        this.numberPositions.push(position);
        return position;
    };
    ScreenshotService.prototype.isNumberOverlapping = function (position) {
        var circleRadius = 12;
        return this.numberPositions.some(function (existingPosition) {
            return Math.sqrt(Math.pow(position.x - existingPosition.x, 2) +
                Math.pow(position.y - existingPosition.y, 2)) <
                circleRadius * 2;
        });
    };
    ScreenshotService.prototype.saveAndOpenScreenshot = function (screenshot) {
        return __awaiter(this, void 0, void 0, function () {
            var screenshotDir, timestamp, filename;
            return __generator(this, function (_a) {
                screenshotDir = path_1.default.join(process.cwd(), "screenshots");
                if (!fs_1.default.existsSync(screenshotDir)) {
                    fs_1.default.mkdirSync(screenshotDir);
                }
                timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                filename = path_1.default.join(screenshotDir, "screenshot-".concat(timestamp, ".png"));
                fs_1.default.writeFileSync(filename, screenshot);
                this.log({
                    category: "screenshotService",
                    message: "screenshot saved",
                    level: 1,
                    auxiliary: {
                        filename: {
                            value: filename,
                            type: "string",
                        },
                    },
                });
                // Open the screenshot with the default image viewer
                if (process.platform === "win32") {
                    (0, child_process_1.exec)("start ".concat(filename));
                }
                else if (process.platform === "darwin") {
                    (0, child_process_1.exec)("open ".concat(filename));
                }
                else {
                    (0, child_process_1.exec)("xdg-open ".concat(filename));
                }
                return [2 /*return*/];
            });
        });
    };
    return ScreenshotService;
}());
exports.ScreenshotService = ScreenshotService;
