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
exports.StagehandExtractHandler = void 0;
var inference_1 = require("../inference");
var utils_1 = require("../utils");
var PROXIMITY_THRESHOLD = 15;
/**
 * The `StagehandExtractHandler` class is responsible for extracting structured data from a webpage.
 * It provides two approaches: `textExtract` and `domExtract`. `textExtract` is used by default.
 *
 * Here is what `textExtract` does at a high level:
 *
 * **1. Wait for the DOM to settle and start DOM debugging.**
 *    - Ensures the page is fully loaded and stable before extraction.
 *
 * **2. Store the original DOM before any mutations.**
 *    - Preserves the initial state of the DOM to restore later.
 *    - We do this because creating spans around every word in the DOM (see step 4)
 *      becomes very difficult to revert. Text nodes can be finicky, and directly
 *      removing the added spans often corrupts the structure of the DOM.
 *
 * **3. Process the DOM to generate a selector map of candidate elements.**
 *    - Identifies potential elements that contain the data to extract.
 *
 * **4. Create text bounding boxes around every word in the webpage.**
 *    - Wraps words in spans so that their bounding boxes can be used to
 *      determine their positions on the text-rendered-webpage.
 *
 * **5. Collect all text annotations (with positions and dimensions) from each of the candidate elements.**
 *    - Gathers text and positional data for each word.
 *
 * **6. Group annotations by text and deduplicate them based on proximity.**
 *    - There is no guarantee that the text annotations are unique (candidate elements can be nested).
 *    - Thus, we must remove duplicate words that are close to each other on the page.
 *
 * **7. Restore the original DOM after mutations.**
 *    - Returns the DOM to its original state after processing.
 *
 * **8. Format the deduplicated annotations into a text representation.**
 *    - Prepares the text data for the extraction process.
 *
 * **9. Pass the formatted text to an LLM for extraction according to the given instruction and schema.**
 *    - Uses a language model to extract structured data based on instructions.
 *
 * **10. Handle the extraction response and logging the results.**
 *     - Processes the output from the LLM and logs relevant information.
 *
 *
 * Here is what `domExtract` does at a high level:
 *
 * **1. Wait for the DOM to settle and start DOM debugging.**
 *   - Ensures the page is fully loaded and stable before extraction.
 *
 * **2. Process the DOM in chunks.**
 *   - The `processDom` function:
 *     - Divides the page into vertical "chunks" based on viewport height.
 *     - Picks the next chunk that hasn't been processed yet.
 *     - Scrolls to that chunk and extracts candidate elements.
 *     - Returns `outputString` (HTML snippets of candidate elements),
 *       `selectorMap` (the XPaths of the candidate elements),
 *       `chunk` (the current chunk index), and `chunks` (the array of all chunk indices).
 *   - This chunk-based approach ensures that large or lengthy pages can be processed in smaller, manageable sections.
 *
 * **3. Pass the extracted DOM elements (in `outputString`) to the LLM for structured data extraction.**
 *   - Uses the instructions, schema, and previously extracted content as context to
 *     guide the LLM in extracting the structured data.
 *
 * **4. Check if extraction is complete.**
 *    - If the extraction is complete (all chunks have been processed or the LLM determines
 *      that we do not need to continue), return the final result.
 *    - If not, repeat steps 1-4 with the next chunk until extraction is complete or no more chunks remain.
 *
 * @remarks
 * Each step corresponds to specific code segments, as noted in the comments throughout the code.
 */
var StagehandExtractHandler = /** @class */ (function () {
    function StagehandExtractHandler(_a) {
        var stagehand = _a.stagehand, logger = _a.logger, stagehandPage = _a.stagehandPage;
        this.stagehand = stagehand;
        this.logger = logger;
        this.stagehandPage = stagehandPage;
    }
    StagehandExtractHandler.prototype.extract = function (_a) {
        var instruction = _a.instruction, schema = _a.schema, _b = _a.content, content = _b === void 0 ? {} : _b, _c = _a.chunksSeen, chunksSeen = _c === void 0 ? [] : _c, llmClient = _a.llmClient, requestId = _a.requestId, domSettleTimeoutMs = _a.domSettleTimeoutMs, _d = _a.useTextExtract, useTextExtract = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_e) {
                if (useTextExtract) {
                    return [2 /*return*/, this.textExtract({
                            instruction: instruction,
                            schema: schema,
                            content: content,
                            llmClient: llmClient,
                            requestId: requestId,
                            domSettleTimeoutMs: domSettleTimeoutMs,
                        })];
                }
                else {
                    return [2 /*return*/, this.domExtract({
                            instruction: instruction,
                            schema: schema,
                            content: content,
                            chunksSeen: chunksSeen,
                            llmClient: llmClient,
                            requestId: requestId,
                            domSettleTimeoutMs: domSettleTimeoutMs,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    StagehandExtractHandler.prototype.textExtract = function (_a) {
        var instruction = _a.instruction, schema = _a.schema, _b = _a.content, content = _b === void 0 ? {} : _b, llmClient = _a.llmClient, requestId = _a.requestId, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var originalDOM, selectorMap, pageWidth, pageHeight, allAnnotations, _i, _c, xpaths, xpath, boundingBoxes, _d, boundingBoxes_1, box, bottom_left, bottom_left_normalized, annotation, annotationsGroupedByText, _e, allAnnotations_1, annotation, deduplicatedTextAnnotations, _loop_1, _f, _g, _h, text, annotations, formattedText, extractionResponse, completed, output;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        this.logger({
                            category: "extraction",
                            message: "starting extraction",
                            level: 1,
                            auxiliary: {
                                instruction: {
                                    value: instruction,
                                    type: "string",
                                },
                            },
                        });
                        // **1:** Wait for the DOM to settle and start DOM debugging
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 1:
                        // **1:** Wait for the DOM to settle and start DOM debugging
                        _j.sent();
                        return [4 /*yield*/, this.stagehandPage.startDomDebug()];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function () {
                                return window.storeDOM();
                            })];
                    case 3:
                        originalDOM = _j.sent();
                        return [4 /*yield*/, this.stagehand.page.evaluate(function () { return window.processAllOfDom(); })];
                    case 4:
                        selectorMap = (_j.sent()).selectorMap;
                        this.logger({
                            category: "extraction",
                            message: "received output from processAllOfDom. selectorMap has ".concat(Object.keys(selectorMap).length, " entries"),
                            level: 1,
                        });
                        // **4:** Create text bounding boxes around every word in the webpage
                        // calling createTextBoundingBoxes() will create a span around every word on the
                        // webpage. The bounding boxes of these spans will be used to determine their
                        // positions in the text rendered webpage
                        return [4 /*yield*/, this.stagehand.page.evaluate(function () { return window.createTextBoundingBoxes(); })];
                    case 5:
                        // **4:** Create text bounding boxes around every word in the webpage
                        // calling createTextBoundingBoxes() will create a span around every word on the
                        // webpage. The bounding boxes of these spans will be used to determine their
                        // positions in the text rendered webpage
                        _j.sent();
                        return [4 /*yield*/, this.stagehand.page.evaluate(function () { return window.innerWidth; })];
                    case 6:
                        pageWidth = _j.sent();
                        return [4 /*yield*/, this.stagehand.page.evaluate(function () { return window.innerHeight; })];
                    case 7:
                        pageHeight = _j.sent();
                        allAnnotations = [];
                        _i = 0, _c = Object.values(selectorMap);
                        _j.label = 8;
                    case 8:
                        if (!(_i < _c.length)) return [3 /*break*/, 11];
                        xpaths = _c[_i];
                        xpath = xpaths[0];
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function (xpath) { return window.getElementBoundingBoxes(xpath); }, xpath)];
                    case 9:
                        boundingBoxes = _j.sent();
                        for (_d = 0, boundingBoxes_1 = boundingBoxes; _d < boundingBoxes_1.length; _d++) {
                            box = boundingBoxes_1[_d];
                            bottom_left = {
                                x: box.left,
                                y: box.top + box.height,
                            };
                            bottom_left_normalized = {
                                x: box.left / pageWidth,
                                y: (box.top + box.height) / pageHeight,
                            };
                            annotation = {
                                text: box.text,
                                bottom_left: bottom_left,
                                bottom_left_normalized: bottom_left_normalized,
                                width: box.width,
                                height: box.height,
                            };
                            allAnnotations.push(annotation);
                        }
                        _j.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        annotationsGroupedByText = new Map();
                        for (_e = 0, allAnnotations_1 = allAnnotations; _e < allAnnotations_1.length; _e++) {
                            annotation = allAnnotations_1[_e];
                            if (!annotationsGroupedByText.has(annotation.text)) {
                                annotationsGroupedByText.set(annotation.text, []);
                            }
                            annotationsGroupedByText.get(annotation.text).push(annotation);
                        }
                        deduplicatedTextAnnotations = [];
                        _loop_1 = function (text, annotations) {
                            var _loop_2 = function (annotation) {
                                // check if this annotation is close to any existing deduplicated annotation
                                var isDuplicate = deduplicatedTextAnnotations.some(function (existingAnnotation) {
                                    if (existingAnnotation.text !== text)
                                        return false;
                                    var dx = existingAnnotation.bottom_left.x - annotation.bottom_left.x;
                                    var dy = existingAnnotation.bottom_left.y - annotation.bottom_left.y;
                                    var distance = Math.hypot(dx, dy);
                                    // the annotation is a duplicate if it has the same text and its bottom_left
                                    // position is within the PROXIMITY_THRESHOLD of an existing annotation.
                                    // we calculate the Euclidean distance between the two bottom_left points,
                                    // and if the distance is less than PROXIMITY_THRESHOLD,
                                    // the annotation is considered a duplicate.
                                    return distance < PROXIMITY_THRESHOLD;
                                });
                                if (!isDuplicate) {
                                    deduplicatedTextAnnotations.push(annotation);
                                }
                            };
                            for (var _k = 0, annotations_1 = annotations; _k < annotations_1.length; _k++) {
                                var annotation = annotations_1[_k];
                                _loop_2(annotation);
                            }
                        };
                        // here, we deduplicate annotations per text group
                        for (_f = 0, _g = annotationsGroupedByText.entries(); _f < _g.length; _f++) {
                            _h = _g[_f], text = _h[0], annotations = _h[1];
                            _loop_1(text, annotations);
                        }
                        // **7:** Restore the original DOM after mutations
                        return [4 /*yield*/, this.stagehandPage.page.evaluate(function (dom) { return window.restoreDOM(dom); }, originalDOM)];
                    case 12:
                        // **7:** Restore the original DOM after mutations
                        _j.sent();
                        formattedText = (0, utils_1.formatText)(deduplicatedTextAnnotations, pageWidth);
                        return [4 /*yield*/, (0, inference_1.extract)({
                                instruction: instruction,
                                previouslyExtractedContent: content,
                                domElements: formattedText,
                                schema: schema,
                                chunksSeen: 1,
                                chunksTotal: 1,
                                llmClient: llmClient,
                                requestId: requestId,
                            })];
                    case 13:
                        extractionResponse = _j.sent();
                        completed = extractionResponse.metadata.completed, output = __rest(extractionResponse, ["metadata"]);
                        return [4 /*yield*/, this.stagehandPage.cleanupDomDebug()];
                    case 14:
                        _j.sent();
                        // **10:** Handle the extraction response and log the results
                        this.logger({
                            category: "extraction",
                            message: "received extraction response",
                            auxiliary: {
                                extraction_response: {
                                    value: JSON.stringify(extractionResponse),
                                    type: "object",
                                },
                            },
                        });
                        if (completed) {
                            this.logger({
                                category: "extraction",
                                message: "extraction completed successfully",
                                level: 1,
                                auxiliary: {
                                    extraction_response: {
                                        value: JSON.stringify(extractionResponse),
                                        type: "object",
                                    },
                                },
                            });
                        }
                        else {
                            this.logger({
                                category: "extraction",
                                message: "extraction incomplete after processing all data",
                                level: 1,
                                auxiliary: {
                                    extraction_response: {
                                        value: JSON.stringify(extractionResponse),
                                        type: "object",
                                    },
                                },
                            });
                        }
                        return [2 /*return*/, output];
                }
            });
        });
    };
    StagehandExtractHandler.prototype.domExtract = function (_a) {
        var instruction = _a.instruction, schema = _a.schema, _b = _a.content, content = _b === void 0 ? {} : _b, _c = _a.chunksSeen, chunksSeen = _c === void 0 ? [] : _c, llmClient = _a.llmClient, requestId = _a.requestId, domSettleTimeoutMs = _a.domSettleTimeoutMs;
        return __awaiter(this, void 0, void 0, function () {
            var _d, outputString, chunk, chunks, extractionResponse, completed, output;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.logger({
                            category: "extraction",
                            message: "starting extraction using old approach",
                            level: 1,
                            auxiliary: {
                                instruction: {
                                    value: instruction,
                                    type: "string",
                                },
                            },
                        });
                        // **1:** Wait for the DOM to settle and start DOM debugging
                        // This ensures the page is stable before extracting any data.
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 1:
                        // **1:** Wait for the DOM to settle and start DOM debugging
                        // This ensures the page is stable before extracting any data.
                        _e.sent();
                        return [4 /*yield*/, this.stagehandPage.startDomDebug()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, this.stagehand.page.evaluate(function (chunksSeen) { return window.processDom(chunksSeen !== null && chunksSeen !== void 0 ? chunksSeen : []); }, chunksSeen)];
                    case 3:
                        _d = _e.sent(), outputString = _d.outputString, chunk = _d.chunk, chunks = _d.chunks;
                        this.logger({
                            category: "extraction",
                            message: "received output from processDom.",
                            auxiliary: {
                                chunk: {
                                    value: chunk.toString(),
                                    type: "integer",
                                },
                                chunks_left: {
                                    value: (chunks.length - chunksSeen.length).toString(),
                                    type: "integer",
                                },
                                chunks_total: {
                                    value: chunks.length.toString(),
                                    type: "integer",
                                },
                            },
                        });
                        return [4 /*yield*/, (0, inference_1.extract)({
                                instruction: instruction,
                                previouslyExtractedContent: content,
                                domElements: outputString,
                                schema: schema,
                                llmClient: llmClient,
                                chunksSeen: chunksSeen.length,
                                chunksTotal: chunks.length,
                                requestId: requestId,
                                isUsingTextExtract: false,
                            })];
                    case 4:
                        extractionResponse = _e.sent();
                        completed = extractionResponse.metadata.completed, output = __rest(extractionResponse, ["metadata"]);
                        return [4 /*yield*/, this.stagehandPage.cleanupDomDebug()];
                    case 5:
                        _e.sent();
                        this.logger({
                            category: "extraction",
                            message: "received extraction response",
                            auxiliary: {
                                extraction_response: {
                                    value: JSON.stringify(extractionResponse),
                                    type: "object",
                                },
                            },
                        });
                        // Mark the current chunk as processed by adding it to chunksSeen
                        chunksSeen.push(chunk);
                        if (!(completed || chunksSeen.length === chunks.length)) return [3 /*break*/, 6];
                        this.logger({
                            category: "extraction",
                            message: "got response",
                            auxiliary: {
                                extraction_response: {
                                    value: JSON.stringify(extractionResponse),
                                    type: "object",
                                },
                            },
                        });
                        return [2 /*return*/, output];
                    case 6:
                        this.logger({
                            category: "extraction",
                            message: "continuing extraction",
                            auxiliary: {
                                extraction_response: {
                                    value: JSON.stringify(extractionResponse),
                                    type: "object",
                                },
                            },
                        });
                        return [4 /*yield*/, this.stagehandPage._waitForSettledDom(domSettleTimeoutMs)];
                    case 7:
                        _e.sent();
                        // Recursively continue with the next chunk
                        return [2 /*return*/, this.domExtract({
                                instruction: instruction,
                                schema: schema,
                                content: output,
                                chunksSeen: chunksSeen,
                                llmClient: llmClient,
                                domSettleTimeoutMs: domSettleTimeoutMs,
                            })];
                }
            });
        });
    };
    return StagehandExtractHandler;
}());
exports.StagehandExtractHandler = StagehandExtractHandler;
