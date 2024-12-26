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
exports.AnthropicClient = void 0;
var sdk_1 = require("@anthropic-ai/sdk");
var zod_to_json_schema_1 = require("zod-to-json-schema");
var LLMClient_1 = require("./LLMClient");
var AnthropicClient = /** @class */ (function (_super) {
    __extends(AnthropicClient, _super);
    function AnthropicClient(logger, enableCaching, cache, modelName, clientOptions) {
        if (enableCaching === void 0) { enableCaching = false; }
        var _this = _super.call(this, modelName) || this;
        _this.type = "anthropic";
        _this.client = new sdk_1.default(clientOptions);
        _this.logger = logger;
        _this.cache = cache;
        _this.enableCaching = enableCaching;
        _this.modelName = modelName;
        _this.clientOptions = clientOptions;
        return _this;
    }
    AnthropicClient.prototype.createChatCompletion = function (options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var optionsWithoutImage, cacheOptions, cachedResponse, systemMessage, userMessages, formattedMessages, screenshotMessage, anthropicTools, toolDefinition, jsonSchema, _d, schemaProperties, schemaRequired, response, transformedResponse, toolUse, result;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        optionsWithoutImage = __assign({}, options);
                        delete optionsWithoutImage.image;
                        this.logger({
                            category: "anthropic",
                            message: "creating chat completion",
                            level: 1,
                            auxiliary: {
                                options: {
                                    value: JSON.stringify(optionsWithoutImage),
                                    type: "object",
                                },
                            },
                        });
                        cacheOptions = {
                            model: this.modelName,
                            messages: options.messages,
                            temperature: options.temperature,
                            image: options.image,
                            response_model: options.response_model,
                            tools: options.tools,
                            retries: options.retries,
                        };
                        if (!this.enableCaching) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cache.get(cacheOptions, options.requestId)];
                    case 1:
                        cachedResponse = _e.sent();
                        if (cachedResponse) {
                            this.logger({
                                category: "llm_cache",
                                message: "LLM cache hit - returning cached response",
                                level: 1,
                                auxiliary: {
                                    cachedResponse: {
                                        value: JSON.stringify(cachedResponse),
                                        type: "object",
                                    },
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                    cacheOptions: {
                                        value: JSON.stringify(cacheOptions),
                                        type: "object",
                                    },
                                },
                            });
                            return [2 /*return*/, cachedResponse];
                        }
                        else {
                            this.logger({
                                category: "llm_cache",
                                message: "LLM cache miss - no cached response found",
                                level: 1,
                                auxiliary: {
                                    cacheOptions: {
                                        value: JSON.stringify(cacheOptions),
                                        type: "object",
                                    },
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                },
                            });
                        }
                        _e.label = 2;
                    case 2:
                        systemMessage = options.messages.find(function (msg) {
                            if (msg.role === "system") {
                                if (typeof msg.content === "string") {
                                    return true;
                                }
                                else if (Array.isArray(msg.content)) {
                                    return msg.content.every(function (content) { return content.type !== "image_url"; });
                                }
                            }
                            return false;
                        });
                        userMessages = options.messages.filter(function (msg) { return msg.role !== "system"; });
                        formattedMessages = userMessages.map(function (msg) {
                            if (typeof msg.content === "string") {
                                return {
                                    role: msg.role,
                                    content: msg.content,
                                };
                            }
                            else {
                                return {
                                    role: msg.role,
                                    content: msg.content.map(function (content) {
                                        if ("image_url" in content) {
                                            var formattedContent = {
                                                type: "image",
                                                source: {
                                                    type: "base64",
                                                    media_type: "image/jpeg",
                                                    data: content.image_url.url,
                                                },
                                            };
                                            return formattedContent;
                                        }
                                        else {
                                            return { type: "text", text: content.text };
                                        }
                                    }),
                                };
                            }
                        });
                        if (options.image) {
                            screenshotMessage = {
                                role: "user",
                                content: [
                                    {
                                        type: "image",
                                        source: {
                                            type: "base64",
                                            media_type: "image/jpeg",
                                            data: options.image.buffer.toString("base64"),
                                        },
                                    },
                                ],
                            };
                            if (options.image.description &&
                                Array.isArray(screenshotMessage.content)) {
                                screenshotMessage.content.push({
                                    type: "text",
                                    text: options.image.description,
                                });
                            }
                            formattedMessages.push(screenshotMessage);
                        }
                        anthropicTools = (_a = options.tools) === null || _a === void 0 ? void 0 : _a.map(function (tool) {
                            if (tool.type === "function") {
                                return {
                                    name: tool.function.name,
                                    description: tool.function.description,
                                    input_schema: {
                                        type: "object",
                                        properties: tool.function.parameters.properties,
                                        required: tool.function.parameters.required,
                                    },
                                };
                            }
                        });
                        if (options.response_model) {
                            jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(options.response_model.schema);
                            _d = extractSchemaProperties(jsonSchema), schemaProperties = _d.properties, schemaRequired = _d.required;
                            toolDefinition = {
                                name: "print_extracted_data",
                                description: "Prints the extracted data based on the provided schema.",
                                input_schema: {
                                    type: "object",
                                    properties: schemaProperties,
                                    required: schemaRequired,
                                },
                            };
                        }
                        if (toolDefinition) {
                            anthropicTools = anthropicTools !== null && anthropicTools !== void 0 ? anthropicTools : [];
                            anthropicTools.push(toolDefinition);
                        }
                        return [4 /*yield*/, this.client.messages.create({
                                model: this.modelName,
                                max_tokens: options.maxTokens || 8192,
                                messages: formattedMessages,
                                tools: anthropicTools,
                                system: systemMessage
                                    ? systemMessage.content // we can cast because we already filtered out image content
                                    : undefined,
                                temperature: options.temperature,
                            })];
                    case 3:
                        response = _e.sent();
                        this.logger({
                            category: "anthropic",
                            message: "response",
                            level: 1,
                            auxiliary: {
                                response: {
                                    value: JSON.stringify(response),
                                    type: "object",
                                },
                                requestId: {
                                    value: options.requestId,
                                    type: "string",
                                },
                            },
                        });
                        transformedResponse = {
                            id: response.id,
                            object: "chat.completion",
                            created: Date.now(),
                            model: response.model,
                            choices: [
                                {
                                    index: 0,
                                    message: {
                                        role: "assistant",
                                        content: ((_b = response.content.find(function (c) { return c.type === "text"; })) === null || _b === void 0 ? void 0 : _b.text) || null,
                                        tool_calls: response.content
                                            .filter(function (c) { return c.type === "tool_use"; })
                                            .map(function (toolUse) { return ({
                                            id: toolUse.id,
                                            type: "function",
                                            function: {
                                                name: toolUse.name,
                                                arguments: JSON.stringify(toolUse.input),
                                            },
                                        }); }),
                                    },
                                    finish_reason: response.stop_reason,
                                },
                            ],
                            usage: {
                                prompt_tokens: response.usage.input_tokens,
                                completion_tokens: response.usage.output_tokens,
                                total_tokens: response.usage.input_tokens + response.usage.output_tokens,
                            },
                        };
                        this.logger({
                            category: "anthropic",
                            message: "transformed response",
                            level: 1,
                            auxiliary: {
                                transformedResponse: {
                                    value: JSON.stringify(transformedResponse),
                                    type: "object",
                                },
                                requestId: {
                                    value: options.requestId,
                                    type: "string",
                                },
                            },
                        });
                        if (options.response_model) {
                            toolUse = response.content.find(function (c) { return c.type === "tool_use"; });
                            if (toolUse && "input" in toolUse) {
                                result = toolUse.input;
                                if (this.enableCaching) {
                                    this.cache.set(cacheOptions, result, options.requestId);
                                }
                                return [2 /*return*/, result]; // anthropic returns this as `unknown`, so we need to cast
                            }
                            else {
                                if (!options.retries || options.retries < 5) {
                                    return [2 /*return*/, this.createChatCompletion(__assign(__assign({}, options), { retries: ((_c = options.retries) !== null && _c !== void 0 ? _c : 0) + 1 }))];
                                }
                                this.logger({
                                    category: "anthropic",
                                    message: "error creating chat completion",
                                    level: 1,
                                    auxiliary: {
                                        requestId: {
                                            value: options.requestId,
                                            type: "string",
                                        },
                                    },
                                });
                                throw new Error("Create Chat Completion Failed: No tool use with input in response");
                            }
                        }
                        if (this.enableCaching) {
                            this.cache.set(cacheOptions, transformedResponse, options.requestId);
                            this.logger({
                                category: "anthropic",
                                message: "cached response",
                                level: 1,
                                auxiliary: {
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                    transformedResponse: {
                                        value: JSON.stringify(transformedResponse),
                                        type: "object",
                                    },
                                    cacheOptions: {
                                        value: JSON.stringify(cacheOptions),
                                        type: "object",
                                    },
                                },
                            });
                        }
                        // if the function was called with a response model, it would have returned earlier
                        // so we can safely cast here to T, which defaults to AnthropicTransformedResponse
                        return [2 /*return*/, transformedResponse];
                }
            });
        });
    };
    return AnthropicClient;
}(LLMClient_1.LLMClient));
exports.AnthropicClient = AnthropicClient;
var extractSchemaProperties = function (jsonSchema) {
    var _a;
    var schemaRoot = ((_a = jsonSchema.definitions) === null || _a === void 0 ? void 0 : _a.MySchema) || jsonSchema;
    return {
        properties: schemaRoot.properties,
        required: schemaRoot.required,
    };
};
