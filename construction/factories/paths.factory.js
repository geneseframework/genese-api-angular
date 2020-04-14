"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_service_1 = require("../services/open-api.service");
var path_item_factory_1 = require("./path-item.factory");
/**
 * Factory for OpenApi Paths objects (Api routes)
 * See https://swagger.io/specification/#pathsObject
 */
var PathsFactory = /** @class */ (function () {
    function PathsFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance(); // Instance of OpenApiService
    }
    /**
     * Starts the creation of the request services by parsing the paths of the genese-api.json file
     */
    PathsFactory.prototype.init = function (target) {
        if (target === null || target === void 0 ? void 0 : target.paths) {
            this.openApiService.openApi.paths = {};
            for (var _i = 0, _a = Object.keys(target.paths); _i < _a.length; _i++) {
                var path = _a[_i];
                this.openApiService.next(target.paths[path], path_item_factory_1.PathItemFactory, path);
            }
        }
    };
    return PathsFactory;
}());
exports.PathsFactory = PathsFactory;
