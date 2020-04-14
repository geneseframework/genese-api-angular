"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_service_1 = require("../../services/tools.service");
var Endpoint = /** @class */ (function () {
    function Endpoint(path) {
        this.path = ''; // The path of the endpoint
        this.pathWithParamsInPascalCase = ''; // The path of the endpoint with params formatted in camelCase
        this.path = path;
    }
    Object.defineProperty(Endpoint.prototype, "endpointWithParamsInPascalCase", {
        /**
         * Returns the path of the endpoint with params formatted in camelCase
         */
        get: function () {
            this.parseParams(this.path);
            return this.pathWithParamsInPascalCase;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Parses recursively a path in order to format its params in camelCase
     * @param path
     */
    Endpoint.prototype.parseParams = function (path) {
        var nextParam = this.getNextParam(path);
        if (nextParam) {
            this.pathWithParamsInPascalCase = "" + this.pathWithParamsInPascalCase + path.slice(0, nextParam.leftIndex) + "${" + nextParam.param + "}";
            var textAfterParam = path.slice(nextParam.rightIndex);
            this.parseParams(textAfterParam);
        }
        else {
            this.pathWithParamsInPascalCase = "" + this.pathWithParamsInPascalCase + path;
        }
    };
    ;
    /**
     * Returns the first param of a path
     * @param path
     */
    Endpoint.prototype.getNextParam = function (path) {
        var firstLeftBracketIndex = path === null || path === void 0 ? void 0 : path.indexOf('{');
        var firstRightBracketIndex = path === null || path === void 0 ? void 0 : path.indexOf('}');
        var endpointParam = undefined;
        if (firstLeftBracketIndex > -1 && firstRightBracketIndex > firstLeftBracketIndex) {
            var param = tools_service_1.toCamelCase(path.slice(firstLeftBracketIndex + 1, firstRightBracketIndex));
            endpointParam = { leftIndex: firstLeftBracketIndex, rightIndex: firstRightBracketIndex + 1, param: param };
        }
        return endpointParam;
    };
    return Endpoint;
}());
exports.Endpoint = Endpoint;
