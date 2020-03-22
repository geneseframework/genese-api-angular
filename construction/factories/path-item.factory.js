"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datatype_factory_1 = require("./datatype.factory");
var get_request_factory_1 = require("./get-request.factory");
var open_api_service_1 = require("../services/open-api.service");
var PathItemFactory = /** @class */ (function () {
    function PathItemFactory() {
        this.openApiService = open_api_service_1.OpenApiService.getInstance();
    }
    PathItemFactory.prototype.init = function (target, route) {
        var _a, _b, _c, _d, _e, _f;
        this.openApiService.openApi.paths[route] = {};
        if ((_c = (_b = (_a = target === null || target === void 0 ? void 0 : target.get) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b['200']) === null || _c === void 0 ? void 0 : _c['content']) {
            var getRequestFactory = new get_request_factory_1.GetRequestFactory();
            getRequestFactory.create(route, (_f = (_e = (_d = target === null || target === void 0 ? void 0 : target.get) === null || _d === void 0 ? void 0 : _d.responses) === null || _e === void 0 ? void 0 : _e['200']) === null || _f === void 0 ? void 0 : _f['content']);
        }
    };
    PathItemFactory.prototype.createDtos = function (path, pathItem) {
        this.createDtoIfMethodExists('get', pathItem);
    };
    PathItemFactory.prototype.createDtoIfMethodExists = function (method, pathItem) {
        if (pathItem === null || pathItem === void 0 ? void 0 : pathItem[method]) {
            this.createDto(method, pathItem);
        }
    };
    PathItemFactory.prototype.createDto = function (method, pathItem) {
        switch (method) {
            case 'get':
                var dtoGetFactory = new get_request_factory_1.GetRequestFactory();
                // dtoGetFactory.create(pathItem[method]);
                break;
            default:
        }
    };
    PathItemFactory.prototype.createDtoFiles = function (source) {
        for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
            var path = _a[_i];
            this.createDtoFile(path, source[path]);
        }
    };
    PathItemFactory.prototype.createDtoFile = function (path, schema) {
        var dtoFile = new datatype_factory_1.DatatypeFactory();
        dtoFile.addPropertiesAndImports(path, schema);
        // this.createFile(this.pathGeneseApi + '/dtos/' + key.toLowerCase() + '.dto.model.ts', dtoFile.getContent());
    };
    PathItemFactory.prototype.extractDtos = function (data) {
        try {
            var api = JSON.parse(data);
            return api.components.schemas;
        }
        catch (err) {
            throw err;
        }
    };
    return PathItemFactory;
}());
exports.PathItemFactory = PathItemFactory;
