"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableModelSchema = void 0;
var zod_1 = require("zod");
exports.AvailableModelSchema = zod_1.z.enum([
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4o-2024-08-06",
    "claude-3-5-sonnet-latest",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620",
    "o1-mini",
    "o1-preview",
]);
