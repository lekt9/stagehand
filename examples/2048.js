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
var lib_1 = require("../lib");
var zod_1 = require("zod");
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var stagehand, _loop_1, error_1, isGameOver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🎮 Starting 2048 bot...");
                    stagehand = new lib_1.Stagehand({
                        env: "EXISTING_CHROME",
                        chromePort: 9222,
                        verbose: 1,
                        debugDom: true,
                        domSettleTimeoutMs: 100,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 10]);
                    console.log("🌟 Initializing Stagehand...");
                    return [4 /*yield*/, stagehand.init()];
                case 2:
                    _a.sent();
                    console.log("🌐 Navigating to 2048...");
                    return [4 /*yield*/, stagehand.page.goto("https://ovolve.github.io/2048-AI/")];
                case 3:
                    _a.sent();
                    console.log("⌛ Waiting for game to initialize...");
                    return [4 /*yield*/, stagehand.page.waitForSelector(".grid-container", { timeout: 10000 })];
                case 4:
                    _a.sent();
                    _loop_1 = function () {
                        var gameState, transposedGrid, grid, analysis, moveKey;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log("🔄 Game loop iteration...");
                                    // Add a small delay for UI updates
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                                case 1:
                                    // Add a small delay for UI updates
                                    _b.sent();
                                    return [4 /*yield*/, stagehand.page.extract({
                                            instruction: "Extract the current game state:\n          1. Score from the score counter\n          2. All tile values in the 4x4 grid (empty spaces as 0)\n          3. Highest tile value present",
                                            schema: zod_1.z.object({
                                                score: zod_1.z.number(),
                                                highestTile: zod_1.z.number(),
                                                grid: zod_1.z.array(zod_1.z.array(zod_1.z.number())),
                                            }),
                                        })];
                                case 2:
                                    gameState = _b.sent();
                                    transposedGrid = gameState.grid[0].map(function (_, colIndex) {
                                        return gameState.grid.map(function (row) { return row[colIndex]; });
                                    });
                                    grid = transposedGrid.map(function (row, rowIndex) {
                                        var _a;
                                        return (_a = {},
                                            _a["row".concat(rowIndex + 1)] = row,
                                            _a);
                                    });
                                    console.log("Game State:", {
                                        score: gameState.score,
                                        highestTile: gameState.highestTile,
                                        grid: grid,
                                    });
                                    return [4 /*yield*/, stagehand.page.extract({
                                            instruction: "Based on the current game state:\n          - Score: ".concat(gameState.score, "\n          - Highest tile: ").concat(gameState.highestTile, "\n          - Grid: This is a 4x4 matrix ordered by row (top to bottom) and column (left to right). The rows are stacked vertically, and tiles can move vertically between rows or horizontally between columns:\n").concat(grid
                                                .map(function (row) {
                                                var rowName = Object.keys(row)[0];
                                                return "             ".concat(rowName, ": ").concat(row[rowName].join(", "));
                                            })
                                                .join("\n"), "\n          What is the best move (up/down/left/right)? Consider:\n          1. Keeping high value tiles in corners (bottom left, bottom right, top left, top right)\n          2. Maintaining a clear path to merge tiles\n          3. Avoiding moves that could block merges\n          4. Only adjacent tiles of the same value can merge\n          5. Making a move will move all tiles in that direction until they hit a tile of a different value or the edge of the board\n          6. Tiles cannot move past the edge of the board\n          7. Each move must move at least one tile"),
                                            schema: zod_1.z.object({
                                                move: zod_1.z.enum(["up", "down", "left", "right"]),
                                                confidence: zod_1.z.number(),
                                                reasoning: zod_1.z.string(),
                                            }),
                                        })];
                                case 3:
                                    analysis = _b.sent();
                                    console.log("Move Analysis:", analysis);
                                    moveKey = {
                                        up: "ArrowUp",
                                        down: "ArrowDown",
                                        left: "ArrowLeft",
                                        right: "ArrowRight",
                                    }[analysis.move];
                                    return [4 /*yield*/, stagehand.page.keyboard.press(moveKey)];
                                case 4:
                                    _b.sent();
                                    console.log("🎯 Executed move:", analysis.move);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 5;
                case 5:
                    if (!true) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error("❌ Error in game loop:", error_1);
                    return [4 /*yield*/, stagehand.page.evaluate(function () {
                            return document.querySelector(".game-over") !== null;
                        })];
                case 9:
                    isGameOver = _a.sent();
                    if (isGameOver) {
                        console.log("🏁 Game Over!");
                        return [2 /*return*/];
                    }
                    throw error_1; // Re-throw non-game-over errors
                case 10: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, example()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
