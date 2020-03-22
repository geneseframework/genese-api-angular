"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.capitalize = function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };
    Tools.unCapitalize = function (word) {
        return word.charAt(0).toLowerCase() + word.slice(1);
    };
    return Tools;
}());
exports.Tools = Tools;
