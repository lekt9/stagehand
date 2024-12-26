"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ActionCache = void 0;
var BaseCache_1 = require("./BaseCache");
/**
 * ActionCache handles logging and retrieving actions along with their Playwright commands.
 */
var ActionCache = /** @class */ (function (_super) {
    __extends(ActionCache, _super);
    function ActionCache(logger, cacheDir, cacheFile) {
        return _super.call(this, logger, cacheDir, cacheFile || "action_cache.json") || this;
    }
    ActionCache.prototype.addActionStep = function (_a) {
        var url = _a.url, action = _a.action, previousSelectors = _a.previousSelectors, playwrightCommand = _a.playwrightCommand, componentString = _a.componentString, xpaths = _a.xpaths, newStepString = _a.newStepString, completed = _a.completed, requestId = _a.requestId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger({
                            category: "action_cache",
                            message: "adding action step to cache",
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
                                url: {
                                    value: url,
                                    type: "string",
                                },
                                previousSelectors: {
                                    value: JSON.stringify(previousSelectors),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, this.set({ url: url, action: action, previousSelectors: previousSelectors }, {
                                playwrightCommand: playwrightCommand,
                                componentString: componentString,
                                xpaths: xpaths,
                                newStepString: newStepString,
                                completed: completed,
                                previousSelectors: previousSelectors,
                                action: action,
                            }, requestId)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves all actions for a specific trajectory.
     * @param trajectoryId - Unique identifier for the trajectory.
     * @param requestId - The identifier for the current request.
     * @returns An array of TrajectoryEntry objects or null if not found.
     */
    ActionCache.prototype.getActionStep = function (_a) {
        var url = _a.url, action = _a.action, previousSelectors = _a.previousSelectors, requestId = _a.requestId;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _super.prototype.get.call(this, { url: url, action: action, previousSelectors: previousSelectors }, requestId)];
                    case 1:
                        data = _b.sent();
                        if (!data) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ActionCache.prototype.removeActionStep = function (cacheHashObj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.delete.call(this, cacheHashObj)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all actions for a specific trajectory.
     * @param trajectoryId - Unique identifier for the trajectory.
     * @param requestId - The identifier for the current request.
     */
    ActionCache.prototype.clearAction = function (requestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.deleteCacheForRequestId.call(this, requestId)];
                    case 1:
                        _a.sent();
                        this.logger({
                            category: "action_cache",
                            message: "cleared action for ID",
                            level: 1,
                            auxiliary: {
                                requestId: {
                                    value: requestId,
                                    type: "string",
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resets the entire action cache.
     */
    ActionCache.prototype.resetCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.resetCache.call(this)];
                    case 1:
                        _a.sent();
                        this.logger({
                            category: "action_cache",
                            message: "Action cache has been reset.",
                            level: 1,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return ActionCache;
}(BaseCache_1.BaseCache));
exports.ActionCache = ActionCache;
