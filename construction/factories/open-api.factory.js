"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_service_1 = require("../services/open-api.service");
var components_factory_1 = require("./components.factory");
var paths_factory_1 = require("./paths.factory");
var OpenApiFactory = /** @class */ (function () {
    function OpenApiFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance();
    }
    OpenApiFactory.prototype.init = function () {
        this.openApiService.openApi = { openapi: this.openApiService.getOpenApiJsonFile().openapi };
        this.createDataTypes();
        this.createEndpointsServices();
    };
    OpenApiFactory.prototype.createDataTypes = function () {
        this.openApiService.next(this.openApiService.getOpenApiJsonFile(), components_factory_1.ComponentsFactory);
    };
    OpenApiFactory.prototype.createEndpointsServices = function () {
        this.openApiService.next(this.openApiService.getOpenApiJsonFile(), paths_factory_1.PathsFactory);
    };
    return OpenApiFactory;
}());
exports.OpenApiFactory = OpenApiFactory;
