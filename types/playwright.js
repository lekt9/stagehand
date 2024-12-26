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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightCommandMethodNotSupportedException = exports.PlaywrightCommandException = void 0;
var PlaywrightCommandException = /** @class */ (function (_super) {
    __extends(PlaywrightCommandException, _super);
    function PlaywrightCommandException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PlaywrightCommandException";
        return _this;
    }
    return PlaywrightCommandException;
}(Error));
exports.PlaywrightCommandException = PlaywrightCommandException;
var PlaywrightCommandMethodNotSupportedException = /** @class */ (function (_super) {
    __extends(PlaywrightCommandMethodNotSupportedException, _super);
    function PlaywrightCommandMethodNotSupportedException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PlaywrightCommandMethodNotSupportedException";
        return _this;
    }
    return PlaywrightCommandMethodNotSupportedException;
}(Error));
exports.PlaywrightCommandMethodNotSupportedException = PlaywrightCommandMethodNotSupportedException;
