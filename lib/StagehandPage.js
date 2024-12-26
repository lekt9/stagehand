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
exports.StagehandPage = void 0;
var actHandler_1 = require("./handlers/actHandler");
var extractHandler_1 = require("./handlers/extractHandler");
var observeHandler_1 = require("./handlers/observeHandler");
var StagehandPage = /** @class */ (function () {
    function StagehandPage(page, stagehand, context, llmClient) {
        this.intPage = Object.assign(page, {
            act: function () {
                throw new Error("act() is not implemented on the base page object");
            },
            extract: function () {
                throw new Error("extract() is not implemented on the base page object");
            },
            observe: function () {
                throw new Error("observe() is not implemented on the base page object");
            },
        });
        this.stagehand = stagehand;
        this.intContext = context;
        this.actHandler = new actHandler_1.StagehandActHandler({
            verbose: this.stagehand.verbose,
            llmProvider: this.stagehand.llmProvider,
            enableCaching: this.stagehand.enableCaching,
            logger: this.stagehand.logger,
            stagehandPage: this,
            stagehandContext: this.intContext,
            llmClient: llmClient,
        });
        this.extractHandler = new extractHandler_1.StagehandExtractHandler({
            stagehand: this.stagehand,
            logger: this.stagehand.logger,
            stagehandPage: this,
        });
        this.observeHandler = new observeHandler_1.StagehandObserveHandler({
            stagehand: this.stagehand,
            logger: this.stagehand.logger,
            stagehandPage: this,
        });
        this.llmClient = llmClient;
    }
    StagehandPage.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page, stagehand;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = this.intPage;
                        stagehand = this.stagehand;
                        this.intPage = new Proxy(page, {
                            get: function (target, prop) {
                                // Override the goto method to add debugDom and waitForSettledDom
                                if (prop === "goto")
                                    return function (url, options) { return __awaiter(_this, void 0, void 0, function () {
                                        var result;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, page.goto(url, options)];
                                                case 1:
                                                    result = _a.sent();
                                                    if (!stagehand.debugDom) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, page.evaluate(function (debugDom) { return (window.showChunks = debugDom); }, stagehand.debugDom)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3: return [4 /*yield*/, this.intPage.waitForLoadState("domcontentloaded")];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this._waitForSettledDom()];
                                                case 5:
                                                    _a.sent();
                                                    return [2 /*return*/, result];
                                            }
                                        });
                                    }); };
                                if (prop === "act") {
                                    return function (options) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, this.act(options)];
                                        });
                                    }); };
                                }
                                if (prop === "extract") {
                                    return function (options) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, this.extract(options)];
                                        });
                                    }); };
                                }
                                if (prop === "observe") {
                                    return function (options) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, this.observe(options)];
                                        });
                                    }); };
                                }
                                return target[prop];
                            },
                        });
                        return [4 /*yield*/, this._waitForSettledDom()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Object.defineProperty(StagehandPage.prototype, "page", {
        get: function () {
            return this.intPage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StagehandPage.prototype, "context", {
        get: function () {
            return this.intContext.context;
        },
        enumerable: false,
        configurable: true
    });
    // We can make methods public because StagehandPage is private to the Stagehand class.
    // When a user gets stagehand.page, they are getting a proxy to the Playwright page.
    // We can override the methods on the proxy to add our own behavior
    StagehandPage.prototype._waitForSettledDom = function (timeoutMs) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout_1, timeoutHandle_1, timeoutPromise, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        timeout_1 = timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : this.stagehand.domSettleTimeoutMs;
                        return [4 /*yield*/, this.page.waitForLoadState("domcontentloaded")];
                    case 1:
                        _a.sent();
                        timeoutPromise = new Promise(function (resolve) {
                            timeoutHandle_1 = setTimeout(function () {
                                _this.stagehand.log({
                                    category: "dom",
                                    message: "DOM settle timeout exceeded, continuing anyway",
                                    level: 1,
                                    auxiliary: {
                                        timeout_ms: {
                                            value: timeout_1.toString(),
                                            type: "integer",
                                        },
                                    },
                                });
                                resolve();
                            }, timeout_1);
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, Promise.race([
                                this.page.evaluate(function () {
                                    return new Promise(function (resolve) {
                                        if (typeof window.waitForDomSettle === "function") {
                                            window.waitForDomSettle().then(resolve);
                                        }
                                        else {
                                            console.warn("waitForDomSettle is not defined, considering DOM as settled");
                                            resolve();
                                        }
                                    });
                                }),
                                this.page.waitForLoadState("domcontentloaded"),
                                this.page.waitForSelector("body"),
                                timeoutPromise,
                            ])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        clearTimeout(timeoutHandle_1);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        this.stagehand.log({
                            category: "dom",
                            message: "Error in waitForSettledDom",
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
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StagehandPage.prototype.startDomDebug = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.stagehand.debugDom) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.page
                                .evaluate(function () {
                                if (typeof window.debugDom === "function") {
                                    window.debugDom();
                                }
                                else {
                                    _this.stagehand.log({
                                        category: "dom",
                                        message: "debugDom is not defined",
                                        level: 1,
                                    });
                                }
                            })
                                .catch(function () { })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        this.stagehand.log({
                            category: "dom",
                            message: "Error in startDomDebug",
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
                            },
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StagehandPage.prototype.cleanupDomDebug = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.stagehand.debugDom) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.page.evaluate(function () { return window.cleanupDebug(); }).catch(function () { })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    StagehandPage.prototype.act = function (_a) {
        var action = _a.action, modelName = _a.modelName, modelClientOptions = _a.modelClientOptions, _b = _a.useVision, useVision = _b === void 0 ? "fallback" : _b, _c = _a.variables, variables = _c === void 0 ? {} : _c, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var requestId, llmClient;
            var _this = this;
            return __generator(this, function (_d) {
                if (!this.actHandler) {
                    throw new Error("Act handler not initialized");
                }
                useVision = useVision !== null && useVision !== void 0 ? useVision : "fallback";
                requestId = Math.random().toString(36).substring(2);
                llmClient = modelName
                    ? this.stagehand.llmProvider.getClient(modelName, modelClientOptions)
                    : this.llmClient;
                this.stagehand.log({
                    category: "act",
                    message: "running act",
                    level: 1,
                    auxiliary: {
                        action: {
                            value: action,
                            type: "string",
                        },
                        requestId: {
                            value: requestId,
                            type: "string",
                        },
                        modelName: {
                            value: llmClient.modelName,
                            type: "string",
                        },
                    },
                });
                return [2 /*return*/, this.actHandler
                        .act({
                        action: action,
                        llmClient: llmClient,
                        chunksSeen: [],
                        useVision: useVision,
                        verifierUseVision: useVision !== false,
                        requestId: requestId,
                        variables: variables,
                        previousSelectors: [],
                        skipActionCacheForThisStep: false,
                        domSettleTimeoutMs: domSettleTimeoutMs,
                    })
                        .catch(function (e) {
                        _this.stagehand.log({
                            category: "act",
                            message: "error acting",
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
                        return {
                            success: false,
                            message: "Internal error: Error acting: ".concat(e.message),
                            action: action,
                        };
                    })];
            });
        });
    };
    StagehandPage.prototype.extract = function (_a) {
        var instruction = _a.instruction, schema = _a.schema, modelName = _a.modelName, modelClientOptions = _a.modelClientOptions, domSettleTimeoutMs = _a.domSettleTimeoutMs, useTextExtract = _a.useTextExtract;
        return __awaiter(this, void 0, void 0, function () {
            var requestId, llmClient;
            var _this = this;
            return __generator(this, function (_b) {
                if (!this.extractHandler) {
                    throw new Error("Extract handler not initialized");
                }
                requestId = Math.random().toString(36).substring(2);
                llmClient = modelName
                    ? this.stagehand.llmProvider.getClient(modelName, modelClientOptions)
                    : this.llmClient;
                this.stagehand.log({
                    category: "extract",
                    message: "running extract",
                    level: 1,
                    auxiliary: {
                        instruction: {
                            value: instruction,
                            type: "string",
                        },
                        requestId: {
                            value: requestId,
                            type: "string",
                        },
                        modelName: {
                            value: llmClient.modelName,
                            type: "string",
                        },
                    },
                });
                return [2 /*return*/, this.extractHandler
                        .extract({
                        instruction: instruction,
                        schema: schema,
                        llmClient: llmClient,
                        requestId: requestId,
                        domSettleTimeoutMs: domSettleTimeoutMs,
                        useTextExtract: useTextExtract,
                    })
                        .catch(function (e) {
                        _this.stagehand.log({
                            category: "extract",
                            message: "error extracting",
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
                        if (_this.stagehand.enableCaching) {
                            _this.stagehand.llmProvider.cleanRequestCache(requestId);
                        }
                        throw e;
                    })];
            });
        });
    };
    StagehandPage.prototype.observe = function (options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var requestId, llmClient;
            var _this = this;
            return __generator(this, function (_c) {
                if (!this.observeHandler) {
                    throw new Error("Observe handler not initialized");
                }
                requestId = Math.random().toString(36).substring(2);
                llmClient = (options === null || options === void 0 ? void 0 : options.modelName)
                    ? this.stagehand.llmProvider.getClient(options.modelName, options.modelClientOptions)
                    : this.llmClient;
                this.stagehand.log({
                    category: "observe",
                    message: "running observe",
                    level: 1,
                    auxiliary: {
                        instruction: {
                            value: options === null || options === void 0 ? void 0 : options.instruction,
                            type: "string",
                        },
                        requestId: {
                            value: requestId,
                            type: "string",
                        },
                        modelName: {
                            value: llmClient.modelName,
                            type: "string",
                        },
                    },
                });
                return [2 /*return*/, this.observeHandler
                        .observe({
                        instruction: (_a = options === null || options === void 0 ? void 0 : options.instruction) !== null && _a !== void 0 ? _a : "Find actions that can be performed on this page.",
                        llmClient: llmClient,
                        useVision: (_b = options === null || options === void 0 ? void 0 : options.useVision) !== null && _b !== void 0 ? _b : false,
                        fullPage: false,
                        requestId: requestId,
                        domSettleTimeoutMs: options === null || options === void 0 ? void 0 : options.domSettleTimeoutMs,
                    })
                        .catch(function (e) {
                        _this.stagehand.log({
                            category: "observe",
                            message: "error observing",
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
                                requestId: {
                                    value: requestId,
                                    type: "string",
                                },
                                instruction: {
                                    value: options === null || options === void 0 ? void 0 : options.instruction,
                                    type: "string",
                                },
                            },
                        });
                        if (_this.stagehand.enableCaching) {
                            _this.stagehand.llmProvider.cleanRequestCache(requestId);
                        }
                        throw e;
                    })];
            });
        });
    };
    return StagehandPage;
}());
exports.StagehandPage = StagehandPage;
