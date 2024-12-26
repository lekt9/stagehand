"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMClient = exports.AnnotatedScreenshotText = exports.modelsWithVision = void 0;
exports.modelsWithVision = [
    "gpt-4o",
    "gpt-4o-mini",
    "claude-3-5-sonnet-latest",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-20241022",
    "gpt-4o-2024-08-06",
];
exports.AnnotatedScreenshotText = "This is a screenshot of the current page state with the elements annotated on it. Each element id is annotated with a number to the top left of it. Duplicate annotations at the same location are under each other vertically.";
var LLMClient = /** @class */ (function () {
    function LLMClient(modelName) {
        this.modelName = modelName;
        this.hasVision = exports.modelsWithVision.includes(modelName);
    }
    return LLMClient;
}());
exports.LLMClient = LLMClient;
