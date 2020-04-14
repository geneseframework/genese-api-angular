"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_method_factory_1 = require("./request-method.factory");
var open_api_service_1 = require("../services/open-api.service");
var request_method_enum_1 = require("../models/requests/request-method.enum");
/**
 * Factory for OpenApi PathItem objects
 * See https://swagger.io/specification/#pathItemObject
 */
var PathItemFactory = /** @class */ (function () {
    function PathItemFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance(); // Instance of OpenApiService
    }
    /**
     * Calls RequestMethodFactory methods in order to add CRUD methods to genese-request.service.ts file
     */
    PathItemFactory.prototype.init = function (pathItem, route) {
        this.openApiService.openApi.paths[route] = {};
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.get) {
            new request_method_factory_1.RequestMethodFactory().addRequestMethod(request_method_enum_1.RequestMethod.GET, route, pathItem);
        }
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.post) {
            new request_method_factory_1.RequestMethodFactory().addRequestMethod(request_method_enum_1.RequestMethod.POST, route, pathItem);
        }
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.delete) {
            new request_method_factory_1.RequestMethodFactory().addRequestMethod(request_method_enum_1.RequestMethod.DELETE, route, pathItem);
        }
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.put) {
            new request_method_factory_1.RequestMethodFactory().addRequestMethod(request_method_enum_1.RequestMethod.PUT, route, pathItem);
        }
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.patch) {
            new request_method_factory_1.RequestMethodFactory().addRequestMethod(request_method_enum_1.RequestMethod.PATCH, route, pathItem);
        }
    };
    return PathItemFactory;
}());
exports.PathItemFactory = PathItemFactory;
