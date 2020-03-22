"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appRootPath = require('app-root-path');
var OpenApiService = /** @class */ (function () {
    function OpenApiService() {
        this.appRoot = appRootPath.toString();
        this.openApi = {};
        this.openApiJsonFile = {};
        this.openApiJsonFile = require(this.appRoot + '/genese-api.json');
    }
    OpenApiService.getInstance = function () {
        if (!OpenApiService.instance) {
            OpenApiService.instance = new OpenApiService();
        }
        return OpenApiService.instance;
    };
    OpenApiService.prototype.getOpenApiJsonFile = function () {
        return this.openApiJsonFile;
    };
    OpenApiService.prototype.next = function (target, propertyClass, options) {
        if (target && propertyClass) {
            var nextPropertyClassObject = new propertyClass();
            if (options) {
                nextPropertyClassObject['init'](target, options);
            }
            else {
                nextPropertyClassObject['init'](target);
            }
        }
        return this;
    };
    return OpenApiService;
}());
exports.OpenApiService = OpenApiService;
