"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMProvider = void 0;
var LLMCache_1 = require("../cache/LLMCache");
var AnthropicClient_1 = require("./AnthropicClient");
var OpenAIClient_1 = require("./OpenAIClient");
var LLMProvider = /** @class */ (function () {
    function LLMProvider(logger, enableCaching) {
        this.modelToProviderMap = {
            "gpt-4o": "openai",
            "gpt-4o-mini": "openai",
            "gpt-4o-2024-08-06": "openai",
            "o1-mini": "openai",
            "o1-preview": "openai",
            "claude-3-5-sonnet-latest": "anthropic",
            "claude-3-5-sonnet-20240620": "anthropic",
            "claude-3-5-sonnet-20241022": "anthropic",
        };
        this.logger = logger;
        this.enableCaching = enableCaching;
        this.cache = enableCaching ? new LLMCache_1.LLMCache(logger) : undefined;
    }
    LLMProvider.prototype.cleanRequestCache = function (requestId) {
        if (!this.enableCaching) {
            return;
        }
        this.logger({
            category: "llm_cache",
            message: "cleaning up cache",
            level: 1,
            auxiliary: {
                requestId: {
                    value: requestId,
                    type: "string",
                },
            },
        });
        this.cache.deleteCacheForRequestId(requestId);
    };
    LLMProvider.prototype.getClient = function (modelName, clientOptions) {
        var provider = this.modelToProviderMap[modelName];
        if (!provider) {
            throw new Error("Unsupported model: ".concat(modelName));
        }
        switch (provider) {
            case "openai":
                return new OpenAIClient_1.OpenAIClient(this.logger, this.enableCaching, this.cache, modelName, clientOptions);
            case "anthropic":
                return new AnthropicClient_1.AnthropicClient(this.logger, this.enableCaching, this.cache, modelName, clientOptions);
            default:
                throw new Error("Unsupported provider: ".concat(provider));
        }
    };
    return LLMProvider;
}());
exports.LLMProvider = LLMProvider;
