"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_service_1 = require("../services/open-api.service");
var schemas_factory_1 = require("./schemas.factory");
var ComponentsFactory = /** @class */ (function () {
    function ComponentsFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance();
    }
    ComponentsFactory.prototype.init = function (target) {
        if (target === null || target === void 0 ? void 0 : target.components) {
            this.openApiService.openApi.components = {};
            this.openApiService.next(target.components, schemas_factory_1.SchemasFactory);
        }
    };
    return ComponentsFactory;
}());
exports.ComponentsFactory = ComponentsFactory;
