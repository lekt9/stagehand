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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StagehandActHandler = void 0;
var playwright_1 = require("../../types/playwright");
var ActionCache_1 = require("../cache/ActionCache");
var inference_1 = require("../inference");
var utils_1 = require("../utils");
var vision_1 = require("../vision");
var StagehandActHandler = /** @class */ (function () {
    function StagehandActHandler(_a) {
        var verbose = _a.verbose, llmProvider = _a.llmProvider, enableCaching = _a.enableCaching, logger = _a.logger, stagehandPage = _a.stagehandPage;
        this.verbose = verbose;
        this.llmProvider = llmProvider;
        this.enableCaching = enableCaching;
        this.logger = logger;
        this.actionCache = enableCaching ? new ActionCache_1.ActionCache(this.logger) : undefined;
        this.actions = {};
        this.stagehandPage = stagehandPage;
    }
    StagehandActHandler.prototype._recordAction = function (action, result) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = (0, utils_1.generateId)(action);
                this.actions[id] = { result: result, action: action };
                return [2 /*return*/, id];
            });
        });
    };
    StagehandActHandler.prototype._verifyActionCompletion = function (_a) {
        var completed = _a.completed, verifierUseVision = _a.verifierUseVision, requestId = _a.requestId, action = _a.action, steps = _a.steps, llmClient = _a.llmClient, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var verifyLLmClient, selectorMap, actionCompleted, domElements, fullpageScreenshot, screenshotService, e_1, screenshotService;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 1:
                        _b.sent();
                        verifyLLmClient = llmClient;
                        if (llmClient.modelName === "o1-mini" ||
                            llmClient.modelName === "o1-preview" ||
                            llmClient.modelName.startsWith("o1-")) {
                            verifyLLmClient = this.llmProvider.getClient("gpt-4o", llmClient.clientOptions);
                        }
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function () {
                                return window.processAllOfDom();
                            })];
                    case 2:
                        selectorMap = (_b.sent()).selectorMap;
                        actionCompleted = false;
                        if (!completed) return [3 /*break*/, 12];
                        // Run action completion verifier
                        this.logger({
                            category: "action",
                            message: "action marked as completed, verifying if this is true...",
                            level: 1,
                            auxiliary: {
                                action: {
                                    value: action,
                                    type: "string",
                                },
                            },
                        });
                        domElements = undefined;
                        fullpageScreenshot = undefined;
                        if (!verifierUseVision) return [3 /*break*/, 8];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 7]);
                        screenshotService = new vision_1.ScreenshotService(this.stagehandPage.page, selectorMap, this.verbose, this.logger);
                        return [4 /*yield*/, screenshotService.getScreenshot(true, 15)];
                    case 4:
                        fullpageScreenshot = _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _b.sent();
                        this.logger({
                            category: "action",
                            message: "error getting full page screenshot. trying again...",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_1.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_1.stack,
                                    type: "string",
                                },
                            },
                        });
                        screenshotService = new vision_1.ScreenshotService(this.stagehandPage.page, selectorMap, this.verbose, this.logger);
                        return [4 /*yield*/, screenshotService.getScreenshot(true, 15)];
                    case 6:
                        fullpageScreenshot = _b.sent();
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.stagehandPage.page.evaluate(function () {
                            return window.processAllOfDom();
                        })];
                    case 9:
                        (domElements = (_b.sent()).outputString);
                        _b.label = 10;
                    case 10: return [4 /*yield*/, (0, inference_1.verifyActCompletion)({
                            goal: action,
                            steps: steps,
                            llmProvider: this.llmProvider,
                            llmClient: verifyLLmClient,
                            screenshot: fullpageScreenshot,
                            domElements: domElements,
                            logger: this.logger,
                            requestId: requestId,
                        })];
                    case 11:
                        actionCompleted = _b.sent();
                        this.logger({
                            category: "action",
                            message: "action completion verification result",
                            level: 1,
                            auxiliary: {
                                action: {
                                    value: action,
                                    type: "string",
                                },
                                result: {
                                    value: actionCompleted.toString(),
                                    type: "boolean",
                                },
                            },
                        });
                        _b.label = 12;
                    case 12: return [2 /*return*/, actionCompleted];
                }
            });
        });
    };
    StagehandActHandler.prototype._performPlaywrightMethod = function (method, args, xpath, domSettleTimeoutMs) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var locator, initialUrl, e_2, text, _i, text_1, char, e_3, key, e_4, e_5, newOpenedTab;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        locator = this.stagehandPage.page.locator("xpath=".concat(xpath)).first();
                        initialUrl = this.stagehandPage.page.url();
                        this.logger({
                            category: "action",
                            message: "performing playwright method",
                            level: 2,
                            auxiliary: {
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                                method: {
                                    value: method,
                                    type: "string",
                                },
                            },
                        });
                        if (!(method === "scrollIntoView")) return [3 /*break*/, 5];
                        this.logger({
                            category: "action",
                            message: "scrolling element into view",
                            level: 2,
                            auxiliary: {
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                            },
                        });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, locator
                                .evaluate(function (element) {
                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                            })
                                .catch(function (e) {
                                _this.logger({
                                    category: "action",
                                    message: "error scrolling element into view",
                                    level: 1,
                                    auxiliary: {
                                        error: {
                                            value: e.message,
                                            type: "string",
                                        },
                                        trace: {
                                            value: e.stack,
                                            type: "string",
                                        },
                                        xpath: {
                                            value: xpath,
                                            type: "string",
                                        },
                                    },
                                });
                            })];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _e.sent();
                        this.logger({
                            category: "action",
                            message: "error scrolling element into view",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_2.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_2.stack,
                                    type: "string",
                                },
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                            },
                        });
                        throw new playwright_1.PlaywrightCommandException(e_2.message);
                    case 4: return [3 /*break*/, 34];
                    case 5:
                        if (!(method === "fill" || method === "type")) return [3 /*break*/, 15];
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 13, , 14]);
                        return [4 /*yield*/, locator.fill("")];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, locator.click()];
                    case 8:
                        _e.sent();
                        text = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toString();
                        _i = 0, text_1 = text;
                        _e.label = 9;
                    case 9:
                        if (!(_i < text_1.length)) return [3 /*break*/, 12];
                        char = text_1[_i];
                        return [4 /*yield*/, this.stagehandPage.page.keyboard.type(char, {
                                delay: Math.random() * 50 + 25,
                            })];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        e_3 = _e.sent();
                        this.logger({
                            category: "action",
                            message: "error filling element",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_3.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_3.stack,
                                    type: "string",
                                },
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                            },
                        });
                        throw new playwright_1.PlaywrightCommandException(e_3.message);
                    case 14: return [3 /*break*/, 34];
                    case 15:
                        if (!(method === "press")) return [3 /*break*/, 20];
                        _e.label = 16;
                    case 16:
                        _e.trys.push([16, 18, , 19]);
                        key = (_b = args[0]) === null || _b === void 0 ? void 0 : _b.toString();
                        return [4 /*yield*/, this.stagehandPage.page.keyboard.press(key)];
                    case 17:
                        _e.sent();
                        return [3 /*break*/, 19];
                    case 18:
                        e_4 = _e.sent();
                        this.logger({
                            category: "action",
                            message: "error pressing key",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_4.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_4.stack,
                                    type: "string",
                                },
                                key: {
                                    value: (_d = (_c = args[0]) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "unknown",
                                    type: "string",
                                },
                            },
                        });
                        throw new playwright_1.PlaywrightCommandException(e_4.message);
                    case 19: return [3 /*break*/, 34];
                    case 20:
                        if (!(typeof locator[method] === "function")) return [3 /*break*/, 33];
                        // Log current URL before action
                        this.logger({
                            category: "action",
                            message: "page URL before action",
                            level: 2,
                            auxiliary: {
                                url: {
                                    value: this.stagehandPage.page.url(),
                                    type: "string",
                                },
                            },
                        });
                        _e.label = 21;
                    case 21:
                        _e.trys.push([21, 23, , 24]);
                        return [4 /*yield*/, locator[method].apply(locator, args.map(function (arg) { return (arg === null || arg === void 0 ? void 0 : arg.toString()) || ""; }))];
                    case 22:
                        _e.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        e_5 = _e.sent();
                        this.logger({
                            category: "action",
                            message: "error performing method",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_5.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_5.stack,
                                    type: "string",
                                },
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                                method: {
                                    value: method,
                                    type: "string",
                                },
                                args: {
                                    value: JSON.stringify(args),
                                    type: "object",
                                },
                            },
                        });
                        throw new playwright_1.PlaywrightCommandException(e_5.message);
                    case 24:
                        if (!(method === "click")) return [3 /*break*/, 32];
                        this.logger({
                            category: "action",
                            message: "clicking element, checking for page navigation",
                            level: 1,
                            auxiliary: {
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, Promise.race([
                                new Promise(function (resolve) {
                                    // TODO: This is a hack to get the new page
                                    // We should find a better way to do this
                                    _this.stagehandPage.context.once("page", function (page) { return resolve(page); });
                                    setTimeout(function () { return resolve(null); }, 1500);
                                }),
                            ])];
                    case 25:
                        newOpenedTab = _e.sent();
                        this.logger({
                            category: "action",
                            message: "clicked element",
                            level: 1,
                            auxiliary: {
                                newOpenedTab: {
                                    value: newOpenedTab ? "opened a new tab" : "no new tabs opened",
                                    type: "string",
                                },
                            },
                        });
                        if (!newOpenedTab) return [3 /*break*/, 30];
                        this.logger({
                            category: "action",
                            message: "new page detected (new tab) with URL",
                            level: 1,
                            auxiliary: {
                                url: {
                                    value: newOpenedTab.url(),
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, newOpenedTab.close()];
                    case 26:
                        _e.sent();
                        return [4 /*yield*/, this.stagehandPage.page.goto(newOpenedTab.url())];
                    case 27:
                        _e.sent();
                        return [4 /*yield*/, this.stagehandPage.page.waitForLoadState("domcontentloaded")];
                    case 28:
                        _e.sent();
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 29:
                        _e.sent();
                        _e.label = 30;
                    case 30: return [4 /*yield*/, Promise.race([
                            this.stagehandPage.page.waitForLoadState("networkidle"),
                            new Promise(function (resolve) { return setTimeout(resolve, 5000); }),
                        ]).catch(function (e) {
                            _this.logger({
                                category: "action",
                                message: "network idle timeout hit",
                                level: 1,
                                auxiliary: {
                                    trace: {
                                        value: e.stack,
                                        type: "string",
                                    },
                                    message: {
                                        value: e.message,
                                        type: "string",
                                    },
                                },
                            });
                        })];
                    case 31:
                        _e.sent();
                        this.logger({
                            category: "action",
                            message: "finished waiting for (possible) page navigation",
                            level: 1,
                        });
                        if (this.stagehandPage.page.url() !== initialUrl) {
                            this.logger({
                                category: "action",
                                message: "new page detected with URL",
                                level: 1,
                                auxiliary: {
                                    url: {
                                        value: this.stagehandPage.page.url(),
                                        type: "string",
                                    },
                                },
                            });
                        }
                        _e.label = 32;
                    case 32: return [3 /*break*/, 34];
                    case 33:
                        this.logger({
                            category: "action",
                            message: "chosen method is invalid",
                            level: 1,
                            auxiliary: {
                                method: {
                                    value: method,
                                    type: "string",
                                },
                            },
                        });
                        throw new playwright_1.PlaywrightCommandMethodNotSupportedException("Method ".concat(method, " not supported"));
                    case 34: return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 35:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StagehandActHandler.prototype._getComponentString = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, locator.evaluate(function (el) {
                            // Create a clone of the element to avoid modifying the original
                            var clone = el.cloneNode(true);
                            // Keep only specific stable attributes that help identify elements
                            var attributesToKeep = [
                                "type",
                                "name",
                                "placeholder",
                                "aria-label",
                                "role",
                                "href",
                                "title",
                                "alt",
                            ];
                            // Remove all attributes except those we want to keep
                            Array.from(clone.attributes).forEach(function (attr) {
                                if (!attributesToKeep.includes(attr.name)) {
                                    clone.removeAttribute(attr.name);
                                }
                            });
                            var outerHtml = clone.outerHTML;
                            //   const variables = {
                            //     // Replace with your actual variables and their values
                            //     // Example:
                            //     username: "JohnDoe",
                            //     email: "john@example.com",
                            //   };
                            //   // Function to replace variable values with variable names
                            //   const replaceVariables = (element: Element) => {
                            //     if (element instanceof HTMLElement) {
                            //       for (const [key, value] of Object.entries(variables)) {
                            //         if (value) {
                            //           element.innerText = element.innerText.replace(
                            //             new RegExp(value, "g"),
                            //             key,
                            //           );
                            //         }
                            //       }
                            //     }
                            //     if (
                            //       element instanceof HTMLInputElement ||
                            //       element instanceof HTMLTextAreaElement
                            //     ) {
                            //       for (const [key, value] of Object.entries(variables)) {
                            //         if (value) {
                            //           element.value = element.value.replace(
                            //             new RegExp(value, "g"),
                            //             key,
                            //           );
                            //         }
                            //       }
                            //     }
                            //   };
                            //   // Replace variables in the cloned element
                            //   replaceVariables(clone);
                            //   // Replace variables in all child elements
                            //   clone.querySelectorAll("*").forEach(replaceVariables);
                            return outerHtml.trim().replace(/\s+/g, " ");
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StagehandActHandler.prototype.getElement = function (xpath, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        return __awaiter(this, void 0, void 0, function () {
            var element, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        element = this.stagehandPage.page.locator("xpath=".concat(xpath)).first();
                        return [4 /*yield*/, element.waitFor({ state: "attached", timeout: timeout })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, element];
                    case 2:
                        _a = _b.sent();
                        this.logger({
                            category: "action",
                            message: "element not found within timeout",
                            level: 1,
                            auxiliary: {
                                xpath: {
                                    value: xpath,
                                    type: "string",
                                },
                                timeout_ms: {
                                    value: timeout.toString(),
                                    type: "integer",
                                },
                            },
                        });
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StagehandActHandler.prototype._checkIfCachedStepIsValid_oneXpath = function (cachedStep) {
        return __awaiter(this, void 0, void 0, function () {
            var locator, _a, currentComponent, normalizedCurrentText, normalizedCachedText, e_6;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.logger({
                            category: "action",
                            message: "checking if cached step is valid",
                            level: 1,
                            auxiliary: {
                                xpath: {
                                    value: cachedStep.xpath,
                                    type: "string",
                                },
                                savedComponentString: {
                                    value: cachedStep.savedComponentString,
                                    type: "string",
                                },
                            },
                        });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.getElement(cachedStep.xpath)];
                    case 2:
                        locator = _e.sent();
                        if (!locator) {
                            this.logger({
                                category: "action",
                                message: "locator not found for xpath",
                                level: 1,
                                auxiliary: {
                                    xpath: {
                                        value: cachedStep.xpath,
                                        type: "string",
                                    },
                                },
                            });
                            return [2 /*return*/, false];
                        }
                        _a = this.logger;
                        _b = {
                            category: "action",
                            message: "locator element",
                            level: 1
                        };
                        _c = {};
                        _d = {};
                        return [4 /*yield*/, this._getComponentString(locator)];
                    case 3:
                        _a.apply(this, [(_b.auxiliary = (_c.componentString = (_d.value = _e.sent(),
                                _d.type = "string",
                                _d),
                                _c),
                                _b)]);
                        return [4 /*yield*/, this._getComponentString(locator)];
                    case 4:
                        currentComponent = _e.sent();
                        this.logger({
                            category: "action",
                            message: "current text",
                            level: 1,
                            auxiliary: {
                                componentString: {
                                    value: currentComponent,
                                    type: "string",
                                },
                            },
                        });
                        if (!currentComponent || !cachedStep.savedComponentString) {
                            this.logger({
                                category: "action",
                                message: "current text or cached text is undefined",
                                level: 1,
                            });
                            return [2 /*return*/, false];
                        }
                        normalizedCurrentText = currentComponent
                            .trim()
                            .replace(/\s+/g, " ");
                        normalizedCachedText = cachedStep.savedComponentString
                            .trim()
                            .replace(/\s+/g, " ");
                        if (normalizedCurrentText !== normalizedCachedText) {
                            this.logger({
                                category: "action",
                                message: "current text and cached text do not match",
                                level: 1,
                                auxiliary: {
                                    currentText: {
                                        value: normalizedCurrentText,
                                        type: "string",
                                    },
                                    cachedText: {
                                        value: normalizedCachedText,
                                        type: "string",
                                    },
                                },
                            });
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 5:
                        e_6 = _e.sent();
                        this.logger({
                            category: "action",
                            message: "error checking if cached step is valid",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: e_6.message,
                                    type: "string",
                                },
                                trace: {
                                    value: e_6.stack,
                                    type: "string",
                                },
                            },
                        });
                        return [2 /*return*/, false]; // Added explicit return false for error cases
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StagehandActHandler.prototype._getValidCachedStepXpath = function (cachedStep) {
        return __awaiter(this, void 0, void 0, function () {
            var reversedXpaths, _i, reversedXpaths_1, xpath, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reversedXpaths = __spreadArray([], cachedStep.xpaths, true).reverse();
                        _i = 0, reversedXpaths_1 = reversedXpaths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < reversedXpaths_1.length)) return [3 /*break*/, 4];
                        xpath = reversedXpaths_1[_i];
                        return [4 /*yield*/, this._checkIfCachedStepIsValid_oneXpath({
                                xpath: xpath,
                                savedComponentString: cachedStep.savedComponentString,
                            })];
                    case 2:
                        isValid = _a.sent();
                        if (isValid) {
                            return [2 /*return*/, xpath];
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    StagehandActHandler.prototype._runCachedActionIfAvailable = function (_a) {
        var _b, _c;
        var action = _a.action, previousSelectors = _a.previousSelectors, requestId = _a.requestId, steps = _a.steps, chunksSeen = _a.chunksSeen, llmClient = _a.llmClient, useVision = _a.useVision, verifierUseVision = _a.verifierUseVision, retries = _a.retries, variables = _a.variables, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var cacheObj, cachedStep, validXpath, actionCompleted, exception_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.enableCaching) {
                            return [2 /*return*/, null];
                        }
                        cacheObj = {
                            url: this.stagehandPage.page.url(),
                            action: action,
                            previousSelectors: previousSelectors,
                            requestId: requestId,
                        };
                        this.logger({
                            category: "action",
                            message: "checking action cache",
                            level: 1,
                            auxiliary: {
                                cacheObj: {
                                    value: JSON.stringify(cacheObj),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, this.actionCache.getActionStep(cacheObj)];
                    case 1:
                        cachedStep = _d.sent();
                        if (!cachedStep) {
                            this.logger({
                                category: "action",
                                message: "action cache miss",
                                level: 1,
                                auxiliary: {
                                    cacheObj: {
                                        value: JSON.stringify(cacheObj),
                                        type: "object",
                                    },
                                },
                            });
                            return [2 /*return*/, null];
                        }
                        this.logger({
                            category: "action",
                            message: "action cache semi-hit",
                            level: 1,
                            auxiliary: {
                                playwrightCommand: {
                                    value: JSON.stringify(cachedStep.playwrightCommand),
                                    type: "object",
                                },
                            },
                        });
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 10, , 12]);
                        return [4 /*yield*/, this._getValidCachedStepXpath({
                                xpaths: cachedStep.xpaths,
                                savedComponentString: cachedStep.componentString,
                            })];
                    case 3:
                        validXpath = _d.sent();
                        this.logger({
                            category: "action",
                            message: "cached action step is valid",
                            level: 1,
                            auxiliary: {
                                validXpath: {
                                    value: validXpath,
                                    type: "string",
                                },
                            },
                        });
                        if (!!validXpath) return [3 /*break*/, 5];
                        this.logger({
                            category: "action",
                            message: "cached action step is invalid, removing...",
                            level: 1,
                            auxiliary: {
                                cacheObj: {
                                    value: JSON.stringify(cacheObj),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, ((_b = this.actionCache) === null || _b === void 0 ? void 0 : _b.removeActionStep(cacheObj))];
                    case 4:
                        _d.sent();
                        return [2 /*return*/, null];
                    case 5:
                        this.logger({
                            category: "action",
                            message: "action cache hit",
                            level: 1,
                            auxiliary: {
                                playwrightCommand: {
                                    value: JSON.stringify(cachedStep.playwrightCommand),
                                    type: "object",
                                },
                            },
                        });
                        cachedStep.playwrightCommand.args = cachedStep.playwrightCommand.args.map(function (arg) {
                            return (0, inference_1.fillInVariables)(arg, variables);
                        });
                        return [4 /*yield*/, this._performPlaywrightMethod(cachedStep.playwrightCommand.method, cachedStep.playwrightCommand.args, validXpath, domSettleTimeoutMs)];
                    case 6:
                        _d.sent();
                        steps = steps + cachedStep.newStepString;
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function (_a) {
                                var chunksSeen = _a.chunksSeen;
                                return window.processDom(chunksSeen);
                            }, { chunksSeen: chunksSeen })];
                    case 7:
                        _d.sent();
                        if (!cachedStep.completed) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._verifyActionCompletion({
                                completed: true,
                                verifierUseVision: verifierUseVision,
                                llmClient: llmClient,
                                steps: steps,
                                requestId: requestId,
                                action: action,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                    case 8:
                        actionCompleted = _d.sent();
                        this.logger({
                            category: "action",
                            message: "action completion verification result from cache",
                            level: 1,
                            auxiliary: {
                                actionCompleted: {
                                    value: actionCompleted.toString(),
                                    type: "boolean",
                                },
                            },
                        });
                        if (actionCompleted) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: "action completed successfully using cached step",
                                    action: action,
                                }];
                        }
                        _d.label = 9;
                    case 9: return [2 /*return*/, this.act({
                            action: action,
                            steps: steps,
                            chunksSeen: chunksSeen,
                            llmClient: llmClient,
                            useVision: useVision,
                            verifierUseVision: verifierUseVision,
                            retries: retries,
                            requestId: requestId,
                            variables: variables,
                            previousSelectors: __spreadArray(__spreadArray([], previousSelectors, true), [cachedStep.xpaths[0]], false),
                            skipActionCacheForThisStep: false,
                            domSettleTimeoutMs: domSettleTimeoutMs,
                        })];
                    case 10:
                        exception_1 = _d.sent();
                        this.logger({
                            category: "action",
                            message: "error performing cached action step",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: exception_1.message,
                                    type: "string",
                                },
                                trace: {
                                    value: exception_1.stack,
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, ((_c = this.actionCache) === null || _c === void 0 ? void 0 : _c.removeActionStep(cacheObj))];
                    case 11:
                        _d.sent();
                        return [2 /*return*/, null];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    StagehandActHandler.prototype.act = function (_a) {
        var _b, _c;
        var action = _a.action, _d = _a.steps, steps = _d === void 0 ? "" : _d, chunksSeen = _a.chunksSeen, llmClient = _a.llmClient, useVision = _a.useVision, verifierUseVision = _a.verifierUseVision, _e = _a.retries, retries = _e === void 0 ? 0 : _e, requestId = _a.requestId, variables = _a.variables, previousSelectors = _a.previousSelectors, _f = _a.skipActionCacheForThisStep, skipActionCacheForThisStep = _f === void 0 ? false : _f, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var response_1, _g, outputString, selectorMap, chunk, chunks, annotatedScreenshot, screenshotService, response, elementId_1, xpaths, method, args_1, elementLines, elementText, initialUrl, locator, originalUrl, componentString, responseArgs, newStepString, actionCompleted, error_1, error_2;
            var _this = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 26, , 27]);
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, this.stagehandPage.startDomDebug()];
                    case 2:
                        _h.sent();
                        if (!(this.enableCaching && !skipActionCacheForThisStep)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._runCachedActionIfAvailable({
                                action: action,
                                previousSelectors: previousSelectors,
                                requestId: requestId,
                                steps: steps,
                                chunksSeen: chunksSeen,
                                llmClient: llmClient,
                                useVision: useVision,
                                verifierUseVision: verifierUseVision,
                                retries: retries,
                                variables: variables,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                    case 3:
                        response_1 = _h.sent();
                        if (response_1 !== null) {
                            return [2 /*return*/, response_1];
                        }
                        else {
                            return [2 /*return*/, this.act({
                                    action: action,
                                    steps: steps,
                                    chunksSeen: chunksSeen,
                                    llmClient: llmClient,
                                    useVision: useVision,
                                    verifierUseVision: verifierUseVision,
                                    retries: retries,
                                    requestId: requestId,
                                    variables: variables,
                                    previousSelectors: previousSelectors,
                                    skipActionCacheForThisStep: true,
                                    domSettleTimeoutMs: domSettleTimeoutMs,
                                })];
                        }
                        _h.label = 4;
                    case 4:
                        if (!llmClient.hasVision && (useVision !== false || verifierUseVision)) {
                            this.logger({
                                category: "action",
                                message: "model does not support vision but useVision was not false. defaulting to false.",
                                level: 1,
                                auxiliary: {
                                    model: {
                                        value: llmClient.modelName,
                                        type: "string",
                                    },
                                    useVision: {
                                        value: useVision.toString(),
                                        type: "boolean",
                                    },
                                },
                            });
                            useVision = false;
                            verifierUseVision = false;
                        }
                        this.logger({
                            category: "action",
                            message: "running / continuing action",
                            level: 2,
                            auxiliary: {
                                action: {
                                    value: action,
                                    type: "string",
                                },
                                pageUrl: {
                                    value: this.stagehandPage.page.url(),
                                    type: "string",
                                },
                            },
                        });
                        this.logger({
                            category: "action",
                            message: "processing DOM",
                            level: 2,
                        });
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function (_a) {
                                var chunksSeen = _a.chunksSeen;
                                return window.processDom(chunksSeen);
                            }, { chunksSeen: chunksSeen })];
                    case 5:
                        _g = _h.sent(), outputString = _g.outputString, selectorMap = _g.selectorMap, chunk = _g.chunk, chunks = _g.chunks;
                        this.logger({
                            category: "action",
                            message: "looking at chunk",
                            level: 1,
                            auxiliary: {
                                chunk: {
                                    value: chunk.toString(),
                                    type: "integer",
                                },
                                chunks: {
                                    value: chunks.length.toString(),
                                    type: "integer",
                                },
                                chunksSeen: {
                                    value: chunksSeen.length.toString(),
                                    type: "integer",
                                },
                                chunksLeft: {
                                    value: (chunks.length - chunksSeen.length).toString(),
                                    type: "integer",
                                },
                            },
                        });
                        annotatedScreenshot = void 0;
                        if (!(useVision === true)) return [3 /*break*/, 8];
                        if (!!llmClient.hasVision) return [3 /*break*/, 6];
                        this.logger({
                            category: "action",
                            message: "model does not support vision. skipping vision processing.",
                            level: 1,
                            auxiliary: {
                                model: {
                                    value: llmClient.modelName,
                                    type: "string",
                                },
                            },
                        });
                        return [3 /*break*/, 8];
                    case 6:
                        screenshotService = new vision_1.ScreenshotService(this.stagehandPage.page, selectorMap, this.verbose, this.logger);
                        return [4 /*yield*/, screenshotService.getAnnotatedScreenshot(false)];
                    case 7:
                        annotatedScreenshot =
                            _h.sent();
                        _h.label = 8;
                    case 8: return [4 /*yield*/, (0, inference_1.act)({
                            action: action,
                            domElements: outputString,
                            steps: steps,
                            llmClient: llmClient,
                            screenshot: annotatedScreenshot,
                            logger: this.logger,
                            requestId: requestId,
                            variables: variables,
                        })];
                    case 9:
                        response = _h.sent();
                        this.logger({
                            category: "action",
                            message: "received response from LLM",
                            level: 1,
                            auxiliary: {
                                response: {
                                    value: JSON.stringify(response),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, this.stagehandPage.cleanupDomDebug()];
                    case 10:
                        _h.sent();
                        if (!!response) return [3 /*break*/, 15];
                        if (!(chunksSeen.length + 1 < chunks.length)) return [3 /*break*/, 11];
                        chunksSeen.push(chunk);
                        this.logger({
                            category: "action",
                            message: "no action found in current chunk",
                            level: 1,
                            auxiliary: {
                                chunksSeen: {
                                    value: chunksSeen.length.toString(),
                                    type: "integer",
                                },
                            },
                        });
                        return [2 /*return*/, this.act({
                                action: action,
                                steps: steps +
                                    (!steps.endsWith("\n") ? "\n" : "") +
                                    "## Step: Scrolled to another section\n",
                                chunksSeen: chunksSeen,
                                llmClient: llmClient,
                                useVision: useVision,
                                verifierUseVision: verifierUseVision,
                                requestId: requestId,
                                variables: variables,
                                previousSelectors: previousSelectors,
                                skipActionCacheForThisStep: skipActionCacheForThisStep,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                    case 11:
                        if (!(useVision === "fallback")) return [3 /*break*/, 14];
                        this.logger({
                            category: "action",
                            message: "switching to vision-based processing",
                            level: 1,
                            auxiliary: {
                                useVision: {
                                    value: useVision.toString(),
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function () {
                                return window.scrollToHeight(0);
                            })];
                    case 12:
                        _h.sent();
                        return [4 /*yield*/, this.act({
                                action: action,
                                steps: steps,
                                chunksSeen: chunksSeen,
                                llmClient: llmClient,
                                useVision: true,
                                verifierUseVision: verifierUseVision,
                                requestId: requestId,
                                variables: variables,
                                previousSelectors: previousSelectors,
                                skipActionCacheForThisStep: skipActionCacheForThisStep,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                    case 13: return [2 /*return*/, _h.sent()];
                    case 14:
                        if (this.enableCaching) {
                            this.llmProvider.cleanRequestCache(requestId);
                            (_b = this.actionCache) === null || _b === void 0 ? void 0 : _b.deleteCacheForRequestId(requestId);
                        }
                        return [2 /*return*/, {
                                success: false,
                                message: "Action was not able to be completed.",
                                action: action,
                            }];
                    case 15:
                        elementId_1 = response["element"];
                        xpaths = selectorMap[elementId_1];
                        method = response["method"];
                        args_1 = response["args"];
                        elementLines = outputString.split("\n");
                        elementText = ((_c = elementLines
                            .find(function (line) { return line.startsWith("".concat(elementId_1, ":")); })) === null || _c === void 0 ? void 0 : _c.split(":")[1]) || "Element not found";
                        this.logger({
                            category: "action",
                            message: "executing method",
                            level: 1,
                            auxiliary: {
                                method: {
                                    value: method,
                                    type: "string",
                                },
                                elementId: {
                                    value: elementId_1.toString(),
                                    type: "integer",
                                },
                                xpaths: {
                                    value: JSON.stringify(xpaths),
                                    type: "object",
                                },
                                args: {
                                    value: JSON.stringify(args_1),
                                    type: "object",
                                },
                            },
                        });
                        _h.label = 16;
                    case 16:
                        _h.trys.push([16, 23, , 25]);
                        initialUrl = this.stagehandPage.page.url();
                        locator = this.stagehandPage.page
                            .locator("xpath=".concat(xpaths[0]))
                            .first();
                        originalUrl = this.stagehandPage.page.url();
                        return [4 /*yield*/, this._getComponentString(locator)];
                    case 17:
                        componentString = _h.sent();
                        responseArgs = __spreadArray([], args_1, true);
                        if (variables) {
                            responseArgs.forEach(function (arg, index) {
                                if (typeof arg === "string") {
                                    args_1[index] = (0, inference_1.fillInVariables)(arg, variables);
                                }
                            });
                        }
                        return [4 /*yield*/, this._performPlaywrightMethod(method, args_1, xpaths[0], domSettleTimeoutMs)];
                    case 18:
                        _h.sent();
                        newStepString = (!steps.endsWith("\n") ? "\n" : "") +
                            "## Step: ".concat(response.step, "\n") +
                            "  Element: ".concat(elementText, "\n") +
                            "  Action: ".concat(response.method, "\n") +
                            "  Reasoning: ".concat(response.why, "\n");
                        steps += newStepString;
                        if (this.enableCaching) {
                            this.actionCache
                                .addActionStep({
                                action: action,
                                url: originalUrl,
                                previousSelectors: previousSelectors,
                                playwrightCommand: {
                                    method: method,
                                    args: responseArgs.map(function (arg) { return (arg === null || arg === void 0 ? void 0 : arg.toString()) || ""; }),
                                },
                                componentString: componentString,
                                requestId: requestId,
                                xpaths: xpaths,
                                newStepString: newStepString,
                                completed: response.completed,
                            })
                                .catch(function (e) {
                                _this.logger({
                                    category: "action",
                                    message: "error adding action step to cache",
                                    level: 1,
                                    auxiliary: {
                                        error: {
                                            value: e.message,
                                            type: "string",
                                        },
                                        trace: {
                                            value: e.stack,
                                            type: "string",
                                        },
                                    },
                                });
                            });
                        }
                        if (this.stagehandPage.page.url() !== initialUrl) {
                            steps += "  Result (Important): Page URL changed from ".concat(initialUrl, " to ").concat(this.stagehandPage.page.url(), "\n\n");
                        }
                        return [4 /*yield*/, this._verifyActionCompletion({
                                completed: response.completed,
                                verifierUseVision: verifierUseVision,
                                requestId: requestId,
                                action: action,
                                steps: steps,
                                llmClient: llmClient,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            }).catch(function (error) {
                                _this.logger({
                                    category: "action",
                                    message: "error verifying action completion. Assuming action completed.",
                                    level: 1,
                                    auxiliary: {
                                        error: {
                                            value: error.message,
                                            type: "string",
                                        },
                                    },
                                });
                                return true;
                            })];
                    case 19:
                        actionCompleted = _h.sent();
                        if (!!actionCompleted) return [3 /*break*/, 20];
                        this.logger({
                            category: "action",
                            message: "continuing to next action step",
                            level: 1,
                        });
                        return [2 /*return*/, this.act({
                                action: action,
                                steps: steps,
                                llmClient: llmClient,
                                chunksSeen: chunksSeen,
                                useVision: useVision,
                                verifierUseVision: verifierUseVision,
                                requestId: requestId,
                                variables: variables,
                                previousSelectors: __spreadArray(__spreadArray([], previousSelectors, true), [xpaths[0]], false),
                                skipActionCacheForThisStep: false,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                    case 20:
                        this.logger({
                            category: "action",
                            message: "action completed successfully",
                            level: 1,
                        });
                        return [4 /*yield*/, this._recordAction(action, response.step)];
                    case 21:
                        _h.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "Action completed successfully: ".concat(steps).concat(response.step),
                                action: action,
                            }];
                    case 22: return [3 /*break*/, 25];
                    case 23:
                        error_1 = _h.sent();
                        this.logger({
                            category: "action",
                            message: "error performing action - d",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: error_1.message,
                                    type: "string",
                                },
                                trace: {
                                    value: error_1.stack,
                                    type: "string",
                                },
                                retries: {
                                    value: retries.toString(),
                                    type: "integer",
                                },
                            },
                        });
                        if (retries < 2) {
                            return [2 /*return*/, this.act({
                                    action: action,
                                    steps: steps,
                                    llmClient: llmClient,
                                    useVision: useVision,
                                    verifierUseVision: verifierUseVision,
                                    retries: retries + 1,
                                    chunksSeen: chunksSeen,
                                    requestId: requestId,
                                    variables: variables,
                                    previousSelectors: previousSelectors,
                                    skipActionCacheForThisStep: skipActionCacheForThisStep,
                                    domSettleTimeoutMs: domSettleTimeoutMs,
                                })];
                        }
                        return [4 /*yield*/, this._recordAction(action, "")];
                    case 24:
                        _h.sent();
                        if (this.enableCaching) {
                            this.llmProvider.cleanRequestCache(requestId);
                            this.actionCache.deleteCacheForRequestId(requestId);
                        }
                        return [2 /*return*/, {
                                success: false,
                                message: "error performing action - a",
                                action: action,
                            }];
                    case 25: return [3 /*break*/, 27];
                    case 26:
                        error_2 = _h.sent();
                        this.logger({
                            category: "action",
                            message: "error performing action - b",
                            level: 1,
                            auxiliary: {
                                error: {
                                    value: error_2.message,
                                    type: "string",
                                },
                                trace: {
                                    value: error_2.stack,
                                    type: "string",
                                },
                            },
                        });
                        if (this.enableCaching) {
                            this.llmProvider.cleanRequestCache(requestId);
                            this.actionCache.deleteCacheForRequestId(requestId);
                        }
                        return [2 /*return*/, {
                                success: false,
                                message: "Error performing action - C: ".concat(error_2.message),
                                action: action,
                            }];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    return StagehandActHandler;
}());
exports.StagehandActHandler = StagehandActHandler;
