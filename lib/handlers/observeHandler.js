"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StagehandObserveHandler = void 0;
var inference_1 = require("../inference");
var utils_1 = require("../utils");
var vision_1 = require("../vision");
var StagehandObserveHandler = /** @class */ (function () {
    function StagehandObserveHandler(_a) {
        var stagehand = _a.stagehand, logger = _a.logger, stagehandPage = _a.stagehandPage;
        this.stagehand = stagehand;
        this.logger = logger;
        this.stagehandPage = stagehandPage;
        this.observations = {};
    }
    StagehandObserveHandler.prototype._recordObservation = function (instruction, result) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = (0, utils_1.generateId)(instruction);
                this.observations[id] = { result: result, instruction: instruction };
                return [2 /*return*/, id];
            });
        });
    };
    StagehandObserveHandler.prototype.observe = function (_a) {
        var instruction = _a.instruction, useVision = _a.useVision, fullPage = _a.fullPage, llmClient = _a.llmClient, requestId = _a.requestId, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var evalResult, selectorMap, outputString, annotatedScreenshot, screenshotService, observationResponse, elementsWithSelectors;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!instruction) {
                            instruction = "Find elements that can be used for any future actions in the page. These may be navigation links, related pages, section/subsection links, buttons, or other interactive elements. Be comprehensive: if there are multiple elements that may be relevant for future actions, return all of them.";
                        }
                        this.logger({
                            category: "observation",
                            message: "starting observation",
                            level: 1,
                            auxiliary: {
                                instruction: {
                                    value: instruction,
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.stagehandPage.startDomDebug()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.stagehand.page.evaluate(function (fullPage) {
                                return fullPage ? window.processAllOfDom() : window.processDom([]);
                            }, fullPage)];
                    case 3:
                        evalResult = _b.sent();
                        selectorMap = evalResult.selectorMap;
                        outputString = evalResult.outputString;
                        if (!(useVision === true)) return [3 /*break*/, 6];
                        if (!!llmClient.hasVision) return [3 /*break*/, 4];
                        this.logger({
                            category: "observation",
                            message: "Model does not support vision. Skipping vision processing.",
                            level: 1,
                            auxiliary: {
                                model: {
                                    value: llmClient.modelName,
                                    type: "string",
                                },
                            },
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        screenshotService = new vision_1.ScreenshotService(this.stagehand.page, selectorMap, this.verbose, this.logger);
                        return [4 /*yield*/, screenshotService.getAnnotatedScreenshot(fullPage)];
                    case 5:
                        annotatedScreenshot =
                            _b.sent();
                        outputString = "n/a. use the image to find the elements.";
                        _b.label = 6;
                    case 6: return [4 /*yield*/, (0, inference_1.observe)({
                            instruction: instruction,
                            domElements: outputString,
                            llmClient: llmClient,
                            image: annotatedScreenshot,
                            requestId: requestId,
                        })];
                    case 7:
                        observationResponse = _b.sent();
                        elementsWithSelectors = observationResponse.elements.map(function (element) {
                            var elementId = element.elementId, rest = __rest(element, ["elementId"]);
                            return __assign(__assign({}, rest), { selector: "xpath=".concat(selectorMap[elementId][0]) });
                        });
                        return [4 /*yield*/, this.stagehandPage.cleanupDomDebug()];
                    case 8:
                        _b.sent();
                        this.logger({
                            category: "observation",
                            message: "found elements",
                            level: 1,
                            auxiliary: {
                                elements: {
                                    value: JSON.stringify(elementsWithSelectors),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, this._recordObservation(instruction, elementsWithSelectors)];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, elementsWithSelectors];
                }
            });
        });
    };
    return StagehandObserveHandler;
}());
exports.StagehandObserveHandler = StagehandObserveHandler;
