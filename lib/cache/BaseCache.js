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
exports.BaseCache = void 0;
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var BaseCache = /** @class */ (function () {
    function BaseCache(logger, cacheDir, cacheFile) {
        if (cacheDir === void 0) { cacheDir = path.join(process.cwd(), "tmp", ".cache"); }
        if (cacheFile === void 0) { cacheFile = "cache.json"; }
        this.CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        this.CLEANUP_PROBABILITY = 0.01; // 1% chance
        this.LOCK_TIMEOUT_MS = 1000;
        this.lockAcquired = false;
        this.lockAcquireFailures = 0;
        // Added for request ID tracking
        this.requestIdToUsedHashes = {};
        this.logger = logger;
        this.cacheDir = cacheDir;
        this.cacheFile = path.join(cacheDir, cacheFile);
        this.lockFile = path.join(cacheDir, "cache.lock");
        this.ensureCacheDirectory();
        this.setupProcessHandlers();
    }
    BaseCache.prototype.setupProcessHandlers = function () {
        var _this = this;
        var releaseLockAndExit = function () {
            _this.releaseLock();
            process.exit();
        };
        process.on("exit", releaseLockAndExit);
        process.on("SIGINT", releaseLockAndExit);
        process.on("SIGTERM", releaseLockAndExit);
        process.on("uncaughtException", function (err) {
            _this.logger({
                category: "base_cache",
                message: "uncaught exception",
                level: 2,
                auxiliary: {
                    error: {
                        value: err.message,
                        type: "string",
                    },
                    trace: {
                        value: err.stack,
                        type: "string",
                    },
                },
            });
            if (_this.lockAcquired) {
                releaseLockAndExit();
            }
        });
    };
    BaseCache.prototype.ensureCacheDirectory = function () {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
            this.logger({
                category: "base_cache",
                message: "created cache directory",
                level: 1,
                auxiliary: {
                    cacheDir: {
                        value: this.cacheDir,
                        type: "string",
                    },
                },
            });
        }
    };
    BaseCache.prototype.createHash = function (data) {
        var hash = crypto.createHash("sha256");
        return hash.update(JSON.stringify(data)).digest("hex");
    };
    BaseCache.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    BaseCache.prototype.acquireLock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, lockAge, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        if (!(Date.now() - startTime < this.LOCK_TIMEOUT_MS)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 3, , 5]);
                        if (fs.existsSync(this.lockFile)) {
                            lockAge = Date.now() - fs.statSync(this.lockFile).mtimeMs;
                            if (lockAge > this.LOCK_TIMEOUT_MS) {
                                fs.unlinkSync(this.lockFile);
                                this.logger({
                                    category: "base_cache",
                                    message: "Stale lock file removed",
                                    level: 1,
                                });
                            }
                        }
                        fs.writeFileSync(this.lockFile, process.pid.toString(), { flag: "wx" });
                        this.lockAcquireFailures = 0;
                        this.lockAcquired = true;
                        this.logger({
                            category: "base_cache",
                            message: "Lock acquired",
                            level: 1,
                        });
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        this.logger({
                            category: "base_cache",
                            message: "error acquiring lock",
                            level: 2,
                            auxiliary: {
                                trace: {
                                    value: e_1.stack,
                                    type: "string",
                                },
                                message: {
                                    value: e_1.message,
                                    type: "string",
                                },
                            },
                        });
                        return [4 /*yield*/, this.sleep(5)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        this.logger({
                            category: "base_cache",
                            message: "Failed to acquire lock after timeout",
                            level: 2,
                        });
                        this.lockAcquireFailures++;
                        if (this.lockAcquireFailures >= 3) {
                            this.logger({
                                category: "base_cache",
                                message: "Failed to acquire lock 3 times in a row. Releasing lock manually.",
                                level: 1,
                            });
                            this.releaseLock();
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    BaseCache.prototype.releaseLock = function () {
        try {
            if (fs.existsSync(this.lockFile)) {
                fs.unlinkSync(this.lockFile);
                this.logger({
                    category: "base_cache",
                    message: "Lock released",
                    level: 1,
                });
            }
            this.lockAcquired = false;
        }
        catch (error) {
            this.logger({
                category: "base_cache",
                message: "error releasing lock",
                level: 2,
                auxiliary: {
                    error: {
                        value: error.message,
                        type: "string",
                    },
                    trace: {
                        value: error.stack,
                        type: "string",
                    },
                },
            });
        }
    };
    /**
     * Cleans up stale cache entries that exceed the maximum age.
     */
    BaseCache.prototype.cleanupStaleEntries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cache, now, entriesRemoved, _i, _a, _b, hash, entry;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.acquireLock()];
                    case 1:
                        if (!(_c.sent())) {
                            this.logger({
                                category: "llm_cache",
                                message: "failed to acquire lock for cleanup",
                                level: 2,
                            });
                            return [2 /*return*/];
                        }
                        try {
                            cache = this.readCache();
                            now = Date.now();
                            entriesRemoved = 0;
                            for (_i = 0, _a = Object.entries(cache); _i < _a.length; _i++) {
                                _b = _a[_i], hash = _b[0], entry = _b[1];
                                if (now - entry.timestamp > this.CACHE_MAX_AGE_MS) {
                                    delete cache[hash];
                                    entriesRemoved++;
                                }
                            }
                            if (entriesRemoved > 0) {
                                this.writeCache(cache);
                                this.logger({
                                    category: "llm_cache",
                                    message: "cleaned up stale cache entries",
                                    level: 1,
                                    auxiliary: {
                                        entriesRemoved: {
                                            value: entriesRemoved.toString(),
                                            type: "integer",
                                        },
                                    },
                                });
                            }
                        }
                        catch (error) {
                            this.logger({
                                category: "llm_cache",
                                message: "error during cache cleanup",
                                level: 2,
                                auxiliary: {
                                    error: {
                                        value: error.message,
                                        type: "string",
                                    },
                                    trace: {
                                        value: error.stack,
                                        type: "string",
                                    },
                                },
                            });
                        }
                        finally {
                            this.releaseLock();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCache.prototype.readCache = function () {
        if (fs.existsSync(this.cacheFile)) {
            try {
                var data = fs.readFileSync(this.cacheFile, "utf-8");
                return JSON.parse(data);
            }
            catch (error) {
                this.logger({
                    category: "base_cache",
                    message: "error reading cache file. resetting cache.",
                    level: 1,
                    auxiliary: {
                        error: {
                            value: error.message,
                            type: "string",
                        },
                        trace: {
                            value: error.stack,
                            type: "string",
                        },
                    },
                });
                this.resetCache();
                return {};
            }
        }
        return {};
    };
    BaseCache.prototype.writeCache = function (cache) {
        try {
            fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2));
            this.logger({
                category: "base_cache",
                message: "Cache written to file",
                level: 1,
            });
        }
        catch (error) {
            this.logger({
                category: "base_cache",
                message: "error writing cache file",
                level: 2,
                auxiliary: {
                    error: {
                        value: error.message,
                        type: "string",
                    },
                    trace: {
                        value: error.stack,
                        type: "string",
                    },
                },
            });
        }
        finally {
            this.releaseLock();
        }
    };
    /**
     * Retrieves data from the cache based on the provided options.
     * @param hashObj - The options used to generate the cache key.
     * @param requestId - The identifier for the current request.
     * @returns The cached data if available, otherwise null.
     */
    BaseCache.prototype.get = function (hashObj, requestId) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.acquireLock()];
                    case 1:
                        if (!(_a.sent())) {
                            this.logger({
                                category: "base_cache",
                                message: "Failed to acquire lock for getting cache",
                                level: 2,
                            });
                            return [2 /*return*/, null];
                        }
                        try {
                            hash = this.createHash(hashObj);
                            cache = this.readCache();
                            if (cache[hash]) {
                                this.trackRequestIdUsage(requestId, hash);
                                return [2 /*return*/, cache[hash].data];
                            }
                            return [2 /*return*/, null];
                        }
                        catch (error) {
                            this.logger({
                                category: "base_cache",
                                message: "error getting cache. resetting cache.",
                                level: 1,
                                auxiliary: {
                                    error: {
                                        value: error.message,
                                        type: "string",
                                    },
                                    trace: {
                                        value: error.stack,
                                        type: "string",
                                    },
                                },
                            });
                            this.resetCache();
                            return [2 /*return*/, null];
                        }
                        finally {
                            this.releaseLock();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stores data in the cache based on the provided options and requestId.
     * @param hashObj - The options used to generate the cache key.
     * @param data - The data to be cached.
     * @param requestId - The identifier for the cache entry.
     */
    BaseCache.prototype.set = function (hashObj, data, requestId) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.acquireLock()];
                    case 1:
                        if (!(_a.sent())) {
                            this.logger({
                                category: "base_cache",
                                message: "Failed to acquire lock for setting cache",
                                level: 2,
                            });
                            return [2 /*return*/];
                        }
                        try {
                            hash = this.createHash(hashObj);
                            cache = this.readCache();
                            cache[hash] = {
                                data: data,
                                timestamp: Date.now(),
                                requestId: requestId,
                            };
                            this.writeCache(cache);
                            this.trackRequestIdUsage(requestId, hash);
                        }
                        catch (error) {
                            this.logger({
                                category: "base_cache",
                                message: "error setting cache. resetting cache.",
                                level: 1,
                                auxiliary: {
                                    error: {
                                        value: error.message,
                                        type: "string",
                                    },
                                    trace: {
                                        value: error.stack,
                                        type: "string",
                                    },
                                },
                            });
                            this.resetCache();
                        }
                        finally {
                            this.releaseLock();
                            if (Math.random() < this.CLEANUP_PROBABILITY) {
                                this.cleanupStaleEntries();
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCache.prototype.delete = function (hashObj) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.acquireLock()];
                    case 1:
                        if (!(_a.sent())) {
                            this.logger({
                                category: "base_cache",
                                message: "Failed to acquire lock for removing cache entry",
                                level: 2,
                            });
                            return [2 /*return*/];
                        }
                        try {
                            hash = this.createHash(hashObj);
                            cache = this.readCache();
                            if (cache[hash]) {
                                delete cache[hash];
                                this.writeCache(cache);
                            }
                            else {
                                this.logger({
                                    category: "base_cache",
                                    message: "Cache entry not found to delete",
                                    level: 1,
                                });
                            }
                        }
                        catch (error) {
                            this.logger({
                                category: "base_cache",
                                message: "error removing cache entry",
                                level: 2,
                                auxiliary: {
                                    error: {
                                        value: error.message,
                                        type: "string",
                                    },
                                    trace: {
                                        value: error.stack,
                                        type: "string",
                                    },
                                },
                            });
                        }
                        finally {
                            this.releaseLock();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Tracks the usage of a hash with a specific requestId.
     * @param requestId - The identifier for the current request.
     * @param hash - The cache key hash.
     */
    BaseCache.prototype.trackRequestIdUsage = function (requestId, hash) {
        var _a;
        var _b;
        (_a = (_b = this.requestIdToUsedHashes)[requestId]) !== null && _a !== void 0 ? _a : (_b[requestId] = []);
        this.requestIdToUsedHashes[requestId].push(hash);
    };
    /**
     * Deletes all cache entries associated with a specific requestId.
     * @param requestId - The identifier for the request whose cache entries should be deleted.
     */
    BaseCache.prototype.deleteCacheForRequestId = function (requestId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cache, hashes, entriesRemoved, _i, hashes_1, hash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.acquireLock()];
                    case 1:
                        if (!(_b.sent())) {
                            this.logger({
                                category: "base_cache",
                                message: "Failed to acquire lock for deleting cache",
                                level: 2,
                            });
                            return [2 /*return*/];
                        }
                        try {
                            cache = this.readCache();
                            hashes = (_a = this.requestIdToUsedHashes[requestId]) !== null && _a !== void 0 ? _a : [];
                            entriesRemoved = 0;
                            for (_i = 0, hashes_1 = hashes; _i < hashes_1.length; _i++) {
                                hash = hashes_1[_i];
                                if (cache[hash]) {
                                    delete cache[hash];
                                    entriesRemoved++;
                                }
                            }
                            if (entriesRemoved > 0) {
                                this.writeCache(cache);
                            }
                            else {
                                this.logger({
                                    category: "base_cache",
                                    message: "no cache entries found for requestId",
                                    level: 1,
                                    auxiliary: {
                                        requestId: {
                                            value: requestId,
                                            type: "string",
                                        },
                                    },
                                });
                            }
                            // Remove the requestId from the mapping after deletion
                            delete this.requestIdToUsedHashes[requestId];
                        }
                        catch (error) {
                            this.logger({
                                category: "base_cache",
                                message: "error deleting cache for requestId",
                                level: 2,
                                auxiliary: {
                                    error: {
                                        value: error.message,
                                        type: "string",
                                    },
                                    trace: {
                                        value: error.stack,
                                        type: "string",
                                    },
                                    requestId: {
                                        value: requestId,
                                        type: "string",
                                    },
                                },
                            });
                        }
                        finally {
                            this.releaseLock();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resets the entire cache by clearing the cache file.
     */
    BaseCache.prototype.resetCache = function () {
        try {
            fs.writeFileSync(this.cacheFile, "{}");
            this.requestIdToUsedHashes = {}; // Reset requestId tracking
        }
        catch (error) {
            this.logger({
                category: "base_cache",
                message: "error resetting cache",
                level: 2,
                auxiliary: {
                    error: {
                        value: error.message,
                        type: "string",
                    },
                    trace: {
                        value: error.stack,
                        type: "string",
                    },
                },
            });
        }
        finally {
            this.releaseLock();
        }
    };
    return BaseCache;
}());
exports.BaseCache = BaseCache;
