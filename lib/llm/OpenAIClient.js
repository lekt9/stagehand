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
exports.OpenAIClient = void 0;
var openai_1 = require("openai");
var zod_1 = require("openai/helpers/zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
var utils_1 = require("../utils");
var LLMClient_1 = require("./LLMClient");
var OpenAIClient = /** @class */ (function (_super) {
    __extends(OpenAIClient, _super);
    function OpenAIClient(logger, enableCaching, cache, modelName, clientOptions) {
        if (enableCaching === void 0) { enableCaching = false; }
        var _this = _super.call(this, modelName) || this;
        _this.type = "openai";
        _this.clientOptions = clientOptions;
        _this.client = new openai_1.default(clientOptions);
        _this.logger = logger;
        _this.cache = cache;
        _this.enableCaching = enableCaching;
        _this.modelName = modelName;
        return _this;
    }
    OpenAIClient.prototype.createChatCompletion = function (optionsInitial, retries) {
        var _a, _b;
        var _c;
        if (retries === void 0) { retries = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var options, isToolsOverridedForO1, tool_choice, top_p, frequency_penalty, presence_penalty, temperature, tools, image, requestId, optionsWithoutImageAndRequestId, cacheOptions, cachedResponse, screenshotMessage, responseFormat, parsedSchema, _d, response_model, openAiOptions, formattedMessages, body, response, parsedContent, extractedData, parsedData;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        options = optionsInitial;
                        isToolsOverridedForO1 = false;
                        if (this.modelName === "o1-mini" || this.modelName === "o1-preview") {
                            tool_choice = options.tool_choice, top_p = options.top_p, frequency_penalty = options.frequency_penalty, presence_penalty = options.presence_penalty, temperature = options.temperature;
                            (_a = options, tool_choice = _a.tool_choice, top_p = _a.top_p, frequency_penalty = _a.frequency_penalty, presence_penalty = _a.presence_penalty, temperature = _a.temperature, options = __rest(_a, ["tool_choice", "top_p", "frequency_penalty", "presence_penalty", "temperature"]));
                            /* eslint-enable */
                            // Remove unsupported options
                            options.messages = options.messages.map(function (message) { return (__assign(__assign({}, message), { role: "user" })); });
                            if (options.tools && options.response_model) {
                                throw new Error("Cannot use both tool and response_model for o1 models");
                            }
                            if (options.tools) {
                                tools = options.tools;
                                (_b = options, tools = _b.tools, options = __rest(_b, ["tools"]));
                                isToolsOverridedForO1 = true;
                                options.messages.push({
                                    role: "user",
                                    content: "You have the following tools available to you:\n".concat(JSON.stringify(tools), "\n\n          Respond with the following zod schema format to use a method: {\n            \"name\": \"<tool_name>\",\n            \"arguments\": <tool_args>\n          }\n          \n          Do not include any other text or formattings like ``` in your response. Just the JSON object."),
                                });
                            }
                        }
                        if (options.temperature &&
                            (this.modelName === "o1-mini" || this.modelName === "o1-preview")) {
                            throw new Error("Temperature is not supported for o1 models");
                        }
                        image = options.image, requestId = options.requestId, optionsWithoutImageAndRequestId = __rest(options, ["image", "requestId"]);
                        this.logger({
                            category: "openai",
                            message: "creating chat completion",
                            level: 1,
                            auxiliary: {
                                options: {
                                    value: JSON.stringify(__assign(__assign({}, optionsWithoutImageAndRequestId), { requestId: requestId })),
                                    type: "object",
                                },
                                modelName: {
                                    value: this.modelName,
                                    type: "string",
                                },
                            },
                        });
                        cacheOptions = {
                            model: this.modelName,
                            messages: options.messages,
                            temperature: options.temperature,
                            top_p: options.top_p,
                            frequency_penalty: options.frequency_penalty,
                            presence_penalty: options.presence_penalty,
                            image: image,
                            response_model: options.response_model,
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
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                    cachedResponse: {
                                        value: JSON.stringify(cachedResponse),
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
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                },
                            });
                        }
                        _e.label = 2;
                    case 2:
                        if (options.image) {
                            screenshotMessage = {
                                role: "user",
                                content: __spreadArray([
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: "data:image/jpeg;base64,".concat(options.image.buffer.toString("base64")),
                                        },
                                    }
                                ], (options.image.description
                                    ? [{ type: "text", text: options.image.description }]
                                    : []), true),
                            };
                            options.messages.push(screenshotMessage);
                        }
                        responseFormat = undefined;
                        if (options.response_model) {
                            // For O1 models, we need to add the schema as a user message.
                            if (this.modelName === "o1-mini" || this.modelName === "o1-preview") {
                                try {
                                    parsedSchema = JSON.stringify((0, zod_to_json_schema_1.default)(options.response_model.schema));
                                    options.messages.push({
                                        role: "user",
                                        content: "Respond in this zod schema format:\n".concat(parsedSchema, "\n\n\n          Do not include any other text, formating or markdown in your output. Do not include ``` or ```json in your response. Only the JSON object itself."),
                                    });
                                }
                                catch (error) {
                                    this.logger({
                                        category: "openai",
                                        message: "Failed to parse response model schema",
                                        level: 0,
                                    });
                                    if (retries > 0) {
                                        // as-casting to account for o1 models not supporting all options
                                        return [2 /*return*/, this.createChatCompletion(options, retries - 1)];
                                    }
                                    throw error;
                                }
                            }
                            else {
                                responseFormat = (0, zod_1.zodResponseFormat)(options.response_model.schema, options.response_model.name);
                            }
                        }
                        _d = __assign(__assign({}, optionsWithoutImageAndRequestId), { model: this.modelName }), response_model = _d.response_model, openAiOptions = __rest(_d, ["response_model"]);
                        /* eslint-enable */
                        this.logger({
                            category: "openai",
                            message: "creating chat completion",
                            level: 1,
                            auxiliary: {
                                openAiOptions: {
                                    value: JSON.stringify(openAiOptions),
                                    type: "object",
                                },
                            },
                        });
                        formattedMessages = options.messages.map(function (message) {
                            if (Array.isArray(message.content)) {
                                var contentParts = message.content.map(function (content) {
                                    if ("image_url" in content) {
                                        var imageContent = {
                                            image_url: {
                                                url: content.image_url.url,
                                            },
                                            type: "image_url",
                                        };
                                        return imageContent;
                                    }
                                    else {
                                        var textContent = {
                                            text: content.text,
                                            type: "text",
                                        };
                                        return textContent;
                                    }
                                });
                                if (message.role === "system") {
                                    var formattedMessage_1 = __assign(__assign({}, message), { role: "system", content: contentParts.filter(function (content) {
                                            return content.type === "text";
                                        }) });
                                    return formattedMessage_1;
                                }
                                else if (message.role === "user") {
                                    var formattedMessage_2 = __assign(__assign({}, message), { role: "user", content: contentParts });
                                    return formattedMessage_2;
                                }
                                else {
                                    var formattedMessage_3 = __assign(__assign({}, message), { role: "assistant", content: contentParts.filter(function (content) {
                                            return content.type === "text";
                                        }) });
                                    return formattedMessage_3;
                                }
                            }
                            var formattedMessage = {
                                role: "user",
                                content: message.content,
                            };
                            return formattedMessage;
                        });
                        body = __assign(__assign({}, openAiOptions), { model: this.modelName, messages: formattedMessages, response_format: responseFormat, stream: false, tools: (_c = options.tools) === null || _c === void 0 ? void 0 : _c.filter(function (tool) { return "function" in tool; }) });
                        return [4 /*yield*/, this.client.chat.completions.create(body)];
                    case 3:
                        response = _e.sent();
                        // For O1 models, we need to parse the tool call response manually and add it to the response.
                        if (isToolsOverridedForO1) {
                            try {
                                parsedContent = JSON.parse(response.choices[0].message.content);
                                response.choices[0].message.tool_calls = [
                                    {
                                        function: {
                                            name: parsedContent["name"],
                                            arguments: JSON.stringify(parsedContent["arguments"]),
                                        },
                                        type: "function",
                                        id: "-1",
                                    },
                                ];
                                response.choices[0].message.content = null;
                            }
                            catch (error) {
                                this.logger({
                                    category: "openai",
                                    message: "Failed to parse tool call response",
                                    level: 0,
                                    auxiliary: {
                                        error: {
                                            value: error.message,
                                            type: "string",
                                        },
                                        content: {
                                            value: response.choices[0].message.content,
                                            type: "string",
                                        },
                                    },
                                });
                                if (retries > 0) {
                                    // as-casting to account for o1 models not supporting all options
                                    return [2 /*return*/, this.createChatCompletion(options, retries - 1)];
                                }
                                throw error;
                            }
                        }
                        this.logger({
                            category: "openai",
                            message: "response",
                            level: 1,
                            auxiliary: {
                                response: {
                                    value: JSON.stringify(response),
                                    type: "object",
                                },
                                requestId: {
                                    value: requestId,
                                    type: "string",
                                },
                            },
                        });
                        if (options.response_model) {
                            extractedData = response.choices[0].message.content;
                            parsedData = JSON.parse(extractedData);
                            if (!(0, utils_1.validateZodSchema)(options.response_model.schema, parsedData)) {
                                if (retries > 0) {
                                    // as-casting to account for o1 models not supporting all options
                                    return [2 /*return*/, this.createChatCompletion(options, retries - 1)];
                                }
                                throw new Error("Invalid response schema");
                            }
                            if (this.enableCaching) {
                                this.cache.set(cacheOptions, __assign({}, parsedData), options.requestId);
                            }
                            return [2 /*return*/, parsedData];
                        }
                        if (this.enableCaching) {
                            this.logger({
                                category: "llm_cache",
                                message: "caching response",
                                level: 1,
                                auxiliary: {
                                    requestId: {
                                        value: options.requestId,
                                        type: "string",
                                    },
                                    cacheOptions: {
                                        value: JSON.stringify(cacheOptions),
                                        type: "object",
                                    },
                                    response: {
                                        value: JSON.stringify(response),
                                        type: "object",
                                    },
                                },
                            });
                            this.cache.set(cacheOptions, response, options.requestId);
                        }
                        // if the function was called with a response model, it would have returned earlier
                        // so we can safely cast here to T, which defaults to ChatCompletion
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return OpenAIClient;
}(LLMClient_1.LLMClient));
exports.OpenAIClient = OpenAIClient;
