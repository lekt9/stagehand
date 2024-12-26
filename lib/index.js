"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stagehand = void 0;
var sdk_1 = require("@browserbasehq/sdk");
var test_1 = require("@playwright/test");
var crypto_1 = require("crypto");
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var scriptContent_1 = require("./dom/build/scriptContent");
var LLMProvider_1 = require("./llm/LLMProvider");
var utils_1 = require("./utils");
var StagehandPage_1 = require("./StagehandPage");
var StagehandContext_1 = require("./StagehandContext");
require("dotenv").config({ path: __dirname + "/.env" });
var DEFAULT_MODEL_NAME = "gpt-4o";
var BROWSERBASE_REGION_DOMAIN = {
  "us-west-2": "wss://connect.usw2.browserbase.com",
  "us-east-1": "wss://connect.use1.browserbase.com",
  "eu-central-1": "wss://connect.euc1.browserbase.com",
  "ap-southeast-1": "wss://connect.apse1.browserbase.com",
};
function getBrowser(
  apiKey,
  projectId,
  env,
  headless,
  logger,
  browserbaseSessionCreateParams,
  browserbaseSessionID,
  chromeUrl,
  chromePort,
) {
  if (env === void 0) {
    env = "LOCAL";
  }
  if (headless === void 0) {
    headless = false;
  }
  return __awaiter(this, void 0, void 0, function () {
    var debugUrl,
      sessionUrl,
      sessionId,
      connectUrl,
      browserbase,
      sessionStatus,
      browserbaseDomain,
      error_1,
      session,
      browser,
      debuggerUrl,
      context,
      connectUrl,
      browser,
      context,
      error_2,
      tmpDirPath,
      tmpDir,
      defaultPreferences,
      downloadsPath,
      context;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (env === "BROWSERBASE") {
            if (!apiKey) {
              logger({
                category: "init",
                message:
                  "BROWSERBASE_API_KEY is required to use BROWSERBASE env. Defaulting to LOCAL.",
                level: 0,
              });
              env = "LOCAL";
            }
            if (!projectId) {
              logger({
                category: "init",
                message:
                  "BROWSERBASE_PROJECT_ID is required for some Browserbase features that may not work without it.",
                level: 1,
              });
            }
          }
          if (!(env === "BROWSERBASE")) return [3 /*break*/, 10];
          if (!apiKey) {
            throw new Error("BROWSERBASE_API_KEY is required.");
          }
          debugUrl = undefined;
          sessionUrl = undefined;
          sessionId = void 0;
          connectUrl = void 0;
          browserbase = new sdk_1.Browserbase({
            apiKey: apiKey,
          });
          if (!browserbaseSessionID) return [3 /*break*/, 5];
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            browserbase.sessions.retrieve(browserbaseSessionID),
          ];
        case 2:
          sessionStatus = _a.sent();
          if (sessionStatus.status !== "RUNNING") {
            throw new Error(
              "Session "
                .concat(browserbaseSessionID, " is not running (status: ")
                .concat(sessionStatus.status, ")"),
            );
          }
          sessionId = browserbaseSessionID;
          browserbaseDomain =
            BROWSERBASE_REGION_DOMAIN[sessionStatus.region] ||
            "wss://connect.browserbase.com";
          connectUrl = ""
            .concat(browserbaseDomain, "?apiKey=")
            .concat(apiKey, "&sessionId=")
            .concat(sessionId);
          logger({
            category: "init",
            message: "resuming existing browserbase session...",
            level: 1,
            auxiliary: {
              sessionId: {
                value: sessionId,
                type: "string",
              },
            },
          });
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          logger({
            category: "init",
            message: "failed to resume session",
            level: 1,
            auxiliary: {
              error: {
                value: error_1.message,
                type: "string",
              },
              trace: {
                value: error_1.stack,
                type: "string",
              },
            },
          });
          throw error_1;
        case 4:
          return [3 /*break*/, 7];
        case 5:
          // Create new session (existing code)
          logger({
            category: "init",
            message: "creating new browserbase session...",
            level: 0,
          });
          if (!projectId) {
            throw new Error(
              "BROWSERBASE_PROJECT_ID is required for new Browserbase sessions.",
            );
          }
          return [
            4 /*yield*/,
            browserbase.sessions.create(
              __assign(
                { projectId: projectId },
                browserbaseSessionCreateParams,
              ),
            ),
          ];
        case 6:
          session = _a.sent();
          sessionId = session.id;
          connectUrl = session.connectUrl;
          logger({
            category: "init",
            message: "created new browserbase session",
            level: 1,
            auxiliary: {
              sessionId: {
                value: sessionId,
                type: "string",
              },
            },
          });
          _a.label = 7;
        case 7:
          return [4 /*yield*/, test_1.chromium.connectOverCDP(connectUrl)];
        case 8:
          browser = _a.sent();
          return [4 /*yield*/, browserbase.sessions.debug(sessionId)];
        case 9:
          debuggerUrl = _a.sent().debuggerUrl;
          debugUrl = debuggerUrl;
          sessionUrl = "https://www.browserbase.com/sessions/".concat(
            sessionId,
          );
          logger({
            category: "init",
            message: browserbaseSessionID
              ? "browserbase session resumed"
              : "browserbase session started",
            level: 0,
            auxiliary: {
              sessionUrl: {
                value: sessionUrl,
                type: "string",
              },
              debugUrl: {
                value: debugUrl,
                type: "string",
              },
              sessionId: {
                value: sessionId,
                type: "string",
              },
            },
          });
          context = browser.contexts()[0];
          return [
            2 /*return*/,
            {
              browser: browser,
              context: context,
              debugUrl: debugUrl,
              sessionUrl: sessionUrl,
              sessionId: sessionId,
              env: env,
            },
          ];
        case 10:
          if (!(env === "EXISTING_CHROME")) return [3 /*break*/, 16];
          logger({
            category: "init",
            message: "connecting to existing Chrome instance...",
            level: 0,
          });
          if (!chromeUrl && !chromePort) {
            throw new Error(
              "Either chromeUrl or chromePort is required for EXISTING_CHROME environment.",
            );
          }
          connectUrl = chromeUrl || "http://localhost:".concat(chromePort);
          _a.label = 11;
        case 11:
          _a.trys.push([11, 14, , 15]);
          return [4 /*yield*/, test_1.chromium.connectOverCDP(connectUrl)];
        case 12:
          browser = _a.sent();
          context = browser.contexts()[0];
          if (!context) {
            throw new Error(
              "No browser context found in the existing Chrome instance.",
            );
          }
          logger({
            category: "init",
            message: "connected to existing Chrome instance",
            level: 0,
            auxiliary: {
              connectUrl: {
                value: connectUrl,
                type: "string",
              },
            },
          });
          return [4 /*yield*/, applyStealthScripts(context)];
        case 13:
          _a.sent();
          return [
            2 /*return*/,
            { browser: browser, context: context, env: "EXISTING_CHROME" },
          ];
        case 14:
          error_2 = _a.sent();
          logger({
            category: "init",
            message: "failed to connect to existing Chrome instance",
            level: 0,
            auxiliary: {
              error: {
                value: error_2.message,
                type: "string",
              },
              trace: {
                value: error_2.stack,
                type: "string",
              },
            },
          });
          throw error_2;
        case 15:
          return [3 /*break*/, 19];
        case 16:
          logger({
            category: "init",
            message: "launching local browser",
            level: 0,
            auxiliary: {
              headless: {
                value: headless.toString(),
                type: "boolean",
              },
            },
          });
          tmpDirPath = path_1.default.join(os_1.default.tmpdir(), "stagehand");
          if (!fs_1.default.existsSync(tmpDirPath)) {
            fs_1.default.mkdirSync(tmpDirPath, { recursive: true });
          }
          tmpDir = fs_1.default.mkdtempSync(
            path_1.default.join(tmpDirPath, "ctx_"),
          );
          fs_1.default.mkdirSync(
            path_1.default.join(tmpDir, "userdir/Default"),
            { recursive: true },
          );
          defaultPreferences = {
            plugins: {
              always_open_pdf_externally: true,
            },
          };
          fs_1.default.writeFileSync(
            path_1.default.join(tmpDir, "userdir/Default/Preferences"),
            JSON.stringify(defaultPreferences),
          );
          downloadsPath = path_1.default.join(process.cwd(), "downloads");
          fs_1.default.mkdirSync(downloadsPath, { recursive: true });
          return [
            4 /*yield*/,
            test_1.chromium.launchPersistentContext(
              path_1.default.join(tmpDir, "userdir"),
              {
                acceptDownloads: true,
                headless: headless,
                viewport: {
                  width: 1250,
                  height: 800,
                },
                locale: "en-US",
                timezoneId: "America/New_York",
                deviceScaleFactor: 1,
                args: [
                  "--enable-webgl",
                  "--use-gl=swiftshader",
                  "--enable-accelerated-2d-canvas",
                  "--disable-blink-features=AutomationControlled",
                  "--disable-web-security",
                ],
                bypassCSP: true,
              },
            ),
          ];
        case 17:
          context = _a.sent();
          logger({
            category: "init",
            message: "local browser started successfully.",
          });
          return [4 /*yield*/, applyStealthScripts(context)];
        case 18:
          _a.sent();
          return [
            2 /*return*/,
            { context: context, contextPath: tmpDir, env: "LOCAL" },
          ];
        case 19:
          return [2 /*return*/];
      }
    });
  });
}
function applyStealthScripts(context) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            context.addInitScript(function () {
              // Override the navigator.webdriver property
              Object.defineProperty(navigator, "webdriver", {
                get: function () {
                  return undefined;
                },
              });
              // Mock languages and plugins to mimic a real browser
              Object.defineProperty(navigator, "languages", {
                get: function () {
                  return ["en-US", "en"];
                },
              });
              Object.defineProperty(navigator, "plugins", {
                get: function () {
                  return [1, 2, 3, 4, 5];
                },
              });
              // Remove Playwright-specific properties
              delete window.__playwright;
              delete window.__pw_manual;
              delete window.__PW_inspect;
              // Redefine the headless property
              Object.defineProperty(navigator, "headless", {
                get: function () {
                  return false;
                },
              });
              // Override the permissions API
              var originalQuery = window.navigator.permissions.query;
              window.navigator.permissions.query = function (parameters) {
                return parameters.name === "notifications"
                  ? Promise.resolve({
                      state: Notification.permission,
                    })
                  : originalQuery(parameters);
              };
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
var Stagehand = /** @class */ (function () {
  function Stagehand(_a) {
    var _b =
        _a === void 0
          ? {
              env: "BROWSERBASE",
            }
          : _a,
      env = _b.env,
      apiKey = _b.apiKey,
      projectId = _b.projectId,
      verbose = _b.verbose,
      debugDom = _b.debugDom,
      llmProvider = _b.llmProvider,
      headless = _b.headless,
      logger = _b.logger,
      browserbaseSessionCreateParams = _b.browserbaseSessionCreateParams,
      domSettleTimeoutMs = _b.domSettleTimeoutMs,
      enableCaching = _b.enableCaching,
      browserbaseSessionID = _b.browserbaseSessionID,
      modelName = _b.modelName,
      modelClientOptions = _b.modelClientOptions,
      chromeUrl = _b.chromeUrl,
      chromePort = _b.chromePort;
    this.pending_logs_to_send_to_browserbase = [];
    this.is_processing_browserbase_logs = false;
    this.externalLogger = logger;
    this.internalLogger = this.log.bind(this);
    this.enableCaching =
      enableCaching !== null && enableCaching !== void 0
        ? enableCaching
        : process.env.ENABLE_CACHING && process.env.ENABLE_CACHING === "true";
    this.llmProvider =
      llmProvider ||
      new LLMProvider_1.LLMProvider(this.logger, this.enableCaching);
    this.intEnv = env;
    this.apiKey =
      apiKey !== null && apiKey !== void 0
        ? apiKey
        : process.env.BROWSERBASE_API_KEY;
    this.projectId =
      projectId !== null && projectId !== void 0
        ? projectId
        : process.env.BROWSERBASE_PROJECT_ID;
    this.verbose = verbose !== null && verbose !== void 0 ? verbose : 0;
    this.debugDom = debugDom !== null && debugDom !== void 0 ? debugDom : false;
    this.llmClient = this.llmProvider.getClient(
      modelName !== null && modelName !== void 0
        ? modelName
        : DEFAULT_MODEL_NAME,
      modelClientOptions,
    );
    this.domSettleTimeoutMs =
      domSettleTimeoutMs !== null && domSettleTimeoutMs !== void 0
        ? domSettleTimeoutMs
        : 30000;
    this.headless = headless !== null && headless !== void 0 ? headless : false;
    this.browserbaseSessionCreateParams = browserbaseSessionCreateParams;
    this.browserbaseSessionID = browserbaseSessionID;
    this.chromeUrl = chromeUrl;
    this.chromePort = chromePort;
  }
  Object.defineProperty(Stagehand.prototype, "logger", {
    get: function () {
      var _this = this;
      return function (logLine) {
        _this.internalLogger(logLine);
        if (_this.externalLogger) {
          _this.externalLogger(logLine);
        }
      };
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Stagehand.prototype, "page", {
    get: function () {
      // End users should not be able to access the StagehandPage directly
      // This is a proxy to the underlying Playwright Page
      if (!this.stagehandPage) {
        throw new Error(
          "Stagehand not initialized. Make sure to await stagehand.init() first.",
        );
      }
      return this.stagehandPage.page;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Stagehand.prototype, "env", {
    get: function () {
      if (this.intEnv === "BROWSERBASE" && this.apiKey && this.projectId) {
        return "BROWSERBASE";
      } else if (this.intEnv === "EXISTING_CHROME") {
        return "EXISTING_CHROME";
      }
      return "LOCAL";
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Stagehand.prototype, "context", {
    get: function () {
      return this.stagehandContext.context;
    },
    enumerable: false,
    configurable: true,
  });
  Stagehand.prototype.init = function (
    /** @deprecated Use constructor options instead */
    initOptions,
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var _a,
        context,
        debugUrl,
        sessionUrl,
        contextPath,
        sessionId,
        env,
        _b,
        defaultPage,
        _c;
      var _this = this;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            if (initOptions) {
              console.warn(
                "Passing parameters to init() is deprecated and will be removed in the next major version. Use constructor options instead.",
              );
            }
            return [
              4 /*yield*/,
              getBrowser(
                this.apiKey,
                this.projectId,
                this.env,
                this.headless,
                this.logger,
                this.browserbaseSessionCreateParams,
                this.browserbaseSessionID,
                this.chromeUrl,
                this.chromePort,
              ).catch(function (e) {
                console.error("Error in init:", e);
                var br = {
                  context: undefined,
                  debugUrl: undefined,
                  sessionUrl: undefined,
                  sessionId: undefined,
                  env: _this.env,
                };
                return br;
              }),
            ];
          case 1:
            (_a = _d.sent()),
              (context = _a.context),
              (debugUrl = _a.debugUrl),
              (sessionUrl = _a.sessionUrl),
              (contextPath = _a.contextPath),
              (sessionId = _a.sessionId),
              (env = _a.env);
            this.intEnv = env;
            this.contextPath = contextPath;
            _b = this;
            return [
              4 /*yield*/,
              StagehandContext_1.StagehandContext.init(context, this),
            ];
          case 2:
            _b.stagehandContext = _d.sent();
            defaultPage = this.context.pages()[0];
            _c = this;
            return [
              4 /*yield*/,
              new StagehandPage_1.StagehandPage(
                defaultPage,
                this,
                this.stagehandContext,
                this.llmClient,
              ).init(),
            ];
          case 3:
            _c.stagehandPage = _d.sent();
            if (!this.headless) return [3 /*break*/, 5];
            return [
              4 /*yield*/,
              this.page.setViewportSize({ width: 1280, height: 720 }),
            ];
          case 4:
            _d.sent();
            _d.label = 5;
          case 5:
            return [
              4 /*yield*/,
              this.context.addInitScript({
                content: scriptContent_1.scriptContent,
              }),
            ];
          case 6:
            _d.sent();
            this.browserbaseSessionID = sessionId;
            return [
              2 /*return*/,
              {
                debugUrl: debugUrl,
                sessionUrl: sessionUrl,
                sessionId: sessionId,
              },
            ];
        }
      });
    });
  };
  /** @deprecated initFromPage is deprecated and will be removed in the next major version. */
  Stagehand.prototype.initFromPage = function (_a) {
    var page = _a.page;
    return __awaiter(this, void 0, void 0, function () {
      var _b, _c, originalGoto;
      var _this = this;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            console.warn(
              "initFromPage is deprecated and will be removed in the next major version. To instantiate from a page, use `browserbaseSessionID` in the constructor.",
            );
            _b = this;
            return [
              4 /*yield*/,
              new StagehandPage_1.StagehandPage(
                page,
                this,
                this.stagehandContext,
                this.llmClient,
              ).init(),
            ];
          case 1:
            _b.stagehandPage = _d.sent();
            _c = this;
            return [
              4 /*yield*/,
              StagehandContext_1.StagehandContext.init(page.context(), this),
            ];
          case 2:
            _c.stagehandContext = _d.sent();
            originalGoto = this.page.goto.bind(this.page);
            this.page.goto = function (url, options) {
              return __awaiter(_this, void 0, void 0, function () {
                var result;
                var _this = this;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, originalGoto(url, options)];
                    case 1:
                      result = _a.sent();
                      if (!this.debugDom) return [3 /*break*/, 3];
                      return [
                        4 /*yield*/,
                        this.page.evaluate(function () {
                          return (window.showChunks = _this.debugDom);
                        }),
                      ];
                    case 2:
                      _a.sent();
                      _a.label = 3;
                    case 3:
                      return [
                        4 /*yield*/,
                        this.page.waitForLoadState("domcontentloaded"),
                      ];
                    case 4:
                      _a.sent();
                      return [
                        4 /*yield*/,
                        this.stagehandPage._waitForSettledDom(),
                      ];
                    case 5:
                      _a.sent();
                      return [2 /*return*/, result];
                  }
                });
              });
            };
            if (!this.headless) return [3 /*break*/, 4];
            return [
              4 /*yield*/,
              this.page.setViewportSize({ width: 1280, height: 720 }),
            ];
          case 3:
            _d.sent();
            _d.label = 4;
          case 4:
            // Add initialization scripts
            return [
              4 /*yield*/,
              this.context.addInitScript({
                content: scriptContent_1.scriptContent,
              }),
            ];
          case 5:
            // Add initialization scripts
            _d.sent();
            return [2 /*return*/, { context: this.context }];
        }
      });
    });
  };
  Stagehand.prototype.log = function (logObj) {
    logObj.level = logObj.level || 1;
    // Normal Logging
    if (this.externalLogger) {
      this.externalLogger(logObj);
    } else {
      var logMessage = (0, utils_1.logLineToString)(logObj);
      console.log(logMessage);
    }
    // Add the logs to the browserbase session
    this.pending_logs_to_send_to_browserbase.push(
      __assign(__assign({}, logObj), { id: (0, crypto_1.randomUUID)() }),
    );
    this._run_browserbase_log_processing_cycle();
  };
  Stagehand.prototype._run_browserbase_log_processing_cycle = function () {
    return __awaiter(this, void 0, void 0, function () {
      var pending_logs, _i, pending_logs_1, logObj;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.is_processing_browserbase_logs) {
              return [2 /*return*/];
            }
            this.is_processing_browserbase_logs = true;
            pending_logs = __spreadArray(
              [],
              this.pending_logs_to_send_to_browserbase,
              true,
            );
            (_i = 0), (pending_logs_1 = pending_logs);
            _a.label = 1;
          case 1:
            if (!(_i < pending_logs_1.length)) return [3 /*break*/, 4];
            logObj = pending_logs_1[_i];
            return [4 /*yield*/, this._log_to_browserbase(logObj)];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            this.is_processing_browserbase_logs = false;
            return [2 /*return*/];
        }
      });
    });
  };
  Stagehand.prototype._log_to_browserbase = function (logObj) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            logObj.level = logObj.level || 1;
            if (!this.stagehandPage) {
              return [2 /*return*/];
            }
            if (!(this.verbose >= logObj.level)) return [3 /*break*/, 2];
            return [
              4 /*yield*/,
              this.page
                .evaluate(function (logObj) {
                  var logMessage = (0, utils_1.logLineToString)(logObj);
                  if (
                    logObj.message.toLowerCase().includes("trace") ||
                    logObj.message.toLowerCase().includes("error:")
                  ) {
                    console.error(logMessage);
                  } else {
                    console.log(logMessage);
                  }
                }, logObj)
                .then(function () {
                  _this.pending_logs_to_send_to_browserbase =
                    _this.pending_logs_to_send_to_browserbase.filter(
                      function (log) {
                        return log.id !== logObj.id;
                      },
                    );
                })
                .catch(function () {
                  // NAVIDTODO: Rerun the log call on the new page
                  // This is expected to happen when the user is changing pages
                  // console.error("Logging Error:", e);
                  // this.log({
                  //   category: "browserbase",
                  //   message: "error logging to browserbase",
                  //   level: 1,
                  //   auxiliary: {
                  //     trace: {
                  //       value: e.stack,
                  //       type: "string",
                  //     },
                  //     message: {
                  //       value: e.message,
                  //       type: "string",
                  //     },
                  //   },
                  // });
                }),
            ];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            return [2 /*return*/];
        }
      });
    });
  };
  /** @deprecated Use stagehand.page.act() instead. This will be removed in the next major release. */
  Stagehand.prototype.act = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.stagehandPage.act(options)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  /** @deprecated Use stagehand.page.extract() instead. This will be removed in the next major release. */
  Stagehand.prototype.extract = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.stagehandPage.extract(options)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  /** @deprecated Use stagehand.page.observe() instead. This will be removed in the next major release. */
  Stagehand.prototype.observe = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.stagehandPage.observe(options)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  Stagehand.prototype.close = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.context.close()];
          case 1:
            _a.sent();
            if (this.contextPath) {
              try {
                fs_1.default.rmSync(this.contextPath, {
                  recursive: true,
                  force: true,
                });
              } catch (e) {
                console.error("Error deleting context directory:", e);
              }
            }
            return [2 /*return*/];
        }
      });
    });
  };
  return Stagehand;
})();
exports.Stagehand = Stagehand;
__exportStar(require("../types/browser"), exports);
__exportStar(require("../types/log"), exports);
__exportStar(require("../types/model"), exports);
__exportStar(require("../types/playwright"), exports);
__exportStar(require("../types/stagehand"), exports);
