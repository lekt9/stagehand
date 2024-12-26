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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = exports.observe = exports.extract = exports.act = exports.fillInVariables = exports.verifyActCompletion = void 0;
var prompt_1 = require("./prompt");
var zod_1 = require("zod");
var LLMClient_1 = require("./llm/LLMClient");
function verifyActCompletion(_a) {
    var goal = _a.goal, steps = _a.steps, llmClient = _a.llmClient, screenshot = _a.screenshot, domElements = _a.domElements, logger = _a.logger, requestId = _a.requestId;
    return __awaiter(this, void 0, void 0, function () {
        var verificationSchema, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    verificationSchema = zod_1.z.object({
                        completed: zod_1.z.boolean().describe("true if the goal is accomplished"),
                    });
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: [
                                (0, prompt_1.buildVerifyActCompletionSystemPrompt)(),
                                (0, prompt_1.buildVerifyActCompletionUserPrompt)(goal, steps, domElements),
                            ],
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            image: screenshot
                                ? {
                                    buffer: screenshot,
                                    description: "This is a screenshot of the whole visible page.",
                                }
                                : undefined,
                            response_model: {
                                name: "Verification",
                                schema: verificationSchema,
                            },
                            requestId: requestId,
                        })];
                case 1:
                    response = _b.sent();
                    if (!response || typeof response !== "object") {
                        logger({
                            category: "VerifyAct",
                            message: "Unexpected response format: " + JSON.stringify(response),
                        });
                        return [2 /*return*/, false];
                    }
                    if (response.completed === undefined) {
                        logger({
                            category: "VerifyAct",
                            message: "Missing 'completed' field in response",
                        });
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, response.completed];
            }
        });
    });
}
exports.verifyActCompletion = verifyActCompletion;
function fillInVariables(text, variables) {
    var processedText = text;
    Object.entries(variables).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var placeholder = "<|".concat(key.toUpperCase(), "|>");
        processedText = processedText.replace(placeholder, value);
    });
    return processedText;
}
exports.fillInVariables = fillInVariables;
function act(_a) {
    var action = _a.action, domElements = _a.domElements, steps = _a.steps, llmClient = _a.llmClient, screenshot = _a.screenshot, _b = _a.retries, retries = _b === void 0 ? 0 : _b, logger = _a.logger, requestId = _a.requestId, variables = _a.variables;
    return __awaiter(this, void 0, void 0, function () {
        var messages, response, toolCalls;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    messages = [
                        (0, prompt_1.buildActSystemPrompt)(),
                        (0, prompt_1.buildActUserPrompt)(action, steps, domElements, variables),
                    ];
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: messages,
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            tool_choice: "auto",
                            tools: prompt_1.actTools,
                            image: screenshot
                                ? { buffer: screenshot, description: LLMClient_1.AnnotatedScreenshotText }
                                : undefined,
                            requestId: requestId,
                        })];
                case 1:
                    response = _c.sent();
                    toolCalls = response.choices[0].message.tool_calls;
                    if (toolCalls && toolCalls.length > 0) {
                        if (toolCalls[0].function.name === "skipSection") {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, JSON.parse(toolCalls[0].function.arguments)];
                    }
                    else {
                        if (retries >= 2) {
                            logger({
                                category: "Act",
                                message: "No tool calls found in response",
                            });
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, act({
                                action: action,
                                domElements: domElements,
                                steps: steps,
                                llmClient: llmClient,
                                retries: retries + 1,
                                logger: logger,
                                requestId: requestId,
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.act = act;
function extract(_a) {
    var instruction = _a.instruction, previouslyExtractedContent = _a.previouslyExtractedContent, domElements = _a.domElements, schema = _a.schema, llmClient = _a.llmClient, chunksSeen = _a.chunksSeen, chunksTotal = _a.chunksTotal, requestId = _a.requestId, isUsingTextExtract = _a.isUsingTextExtract;
    return __awaiter(this, void 0, void 0, function () {
        var isUsingAnthropic, extractionResponse, refinedResponse, metadataSchema, metadataResponse;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isUsingAnthropic = llmClient.type === "anthropic";
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: [
                                (0, prompt_1.buildExtractSystemPrompt)(isUsingAnthropic, isUsingTextExtract),
                                (0, prompt_1.buildExtractUserPrompt)(instruction, domElements, isUsingAnthropic),
                            ],
                            response_model: {
                                schema: schema,
                                name: "Extraction",
                            },
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            requestId: requestId,
                        })];
                case 1:
                    extractionResponse = _b.sent();
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: [
                                (0, prompt_1.buildRefineSystemPrompt)(),
                                (0, prompt_1.buildRefineUserPrompt)(instruction, previouslyExtractedContent, extractionResponse),
                            ],
                            response_model: {
                                schema: schema,
                                name: "RefinedExtraction",
                            },
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            requestId: requestId,
                        })];
                case 2:
                    refinedResponse = _b.sent();
                    metadataSchema = zod_1.z.object({
                        progress: zod_1.z
                            .string()
                            .describe("progress of what has been extracted so far, as concise as possible"),
                        completed: zod_1.z
                            .boolean()
                            .describe("true if the goal is now accomplished. Use this conservatively, only when you are sure that the goal has been completed."),
                    });
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: [
                                (0, prompt_1.buildMetadataSystemPrompt)(),
                                (0, prompt_1.buildMetadataPrompt)(instruction, refinedResponse, chunksSeen, chunksTotal),
                            ],
                            response_model: {
                                name: "Metadata",
                                schema: metadataSchema,
                            },
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            requestId: requestId,
                        })];
                case 3:
                    metadataResponse = _b.sent();
                    return [2 /*return*/, __assign(__assign({}, refinedResponse), { metadata: metadataResponse })];
            }
        });
    });
}
exports.extract = extract;
function observe(_a) {
    var _b, _c;
    var instruction = _a.instruction, domElements = _a.domElements, llmClient = _a.llmClient, image = _a.image, requestId = _a.requestId;
    return __awaiter(this, void 0, void 0, function () {
        var observeSchema, observationResponse, parsedResponse;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    observeSchema = zod_1.z.object({
                        elements: zod_1.z
                            .array(zod_1.z.object({
                            elementId: zod_1.z.number().describe("the number of the element"),
                            description: zod_1.z
                                .string()
                                .describe("a description of the element and what it is relevant for"),
                        }))
                            .describe("an array of elements that match the instruction"),
                    });
                    return [4 /*yield*/, llmClient.createChatCompletion({
                            messages: [
                                (0, prompt_1.buildObserveSystemPrompt)(),
                                (0, prompt_1.buildObserveUserMessage)(instruction, domElements),
                            ],
                            image: image
                                ? { buffer: image, description: LLMClient_1.AnnotatedScreenshotText }
                                : undefined,
                            response_model: {
                                schema: observeSchema,
                                name: "Observation",
                            },
                            temperature: 0.1,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            requestId: requestId,
                        })];
                case 1:
                    observationResponse = _d.sent();
                    parsedResponse = {
                        elements: (_c = (_b = observationResponse.elements) === null || _b === void 0 ? void 0 : _b.map(function (el) { return ({
                            elementId: Number(el.elementId),
                            description: String(el.description),
                        }); })) !== null && _c !== void 0 ? _c : [],
                    };
                    return [2 /*return*/, parsedResponse];
            }
        });
    });
}
exports.observe = observe;
function ask(_a) {
    var question = _a.question, llmClient = _a.llmClient, requestId = _a.requestId;
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, llmClient.createChatCompletion({
                        messages: [(0, prompt_1.buildAskSystemPrompt)(), (0, prompt_1.buildAskUserPrompt)(question)],
                        temperature: 0.1,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                        requestId: requestId,
                    })];
                case 1:
                    response = _b.sent();
                    // The parsing is now handled in the LLM clients
                    return [2 /*return*/, response.choices[0].message.content];
            }
        });
    });
}
exports.ask = ask;
