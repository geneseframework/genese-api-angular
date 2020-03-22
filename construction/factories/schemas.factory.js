"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_service_1 = require("../services/open-api.service");
var datatype_factory_1 = require("./datatype.factory");
var SchemasFactory = /** @class */ (function () {
    function SchemasFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance();
    }
    SchemasFactory.prototype.init = function (target) {
        if (target === null || target === void 0 ? void 0 : target.schemas) {
            this.openApiService.openApi.components.schemas = {};
            this.createDataTypes(target.schemas);
        }
    };
    SchemasFactory.prototype.createDataTypes = function (schemas) {
        for (var _i = 0, _a = Object.keys(schemas); _i < _a.length; _i++) {
            var dataTypeName = _a[_i];
            var dataTypeFactory = new datatype_factory_1.DatatypeFactory();
            dataTypeFactory.create(dataTypeName, schemas[dataTypeName]);
            this.openApiService.openApi.components.schemas[dataTypeName] = schemas[dataTypeName];
        }
    };
    return SchemasFactory;
}());
exports.SchemasFactory = SchemasFactory;
