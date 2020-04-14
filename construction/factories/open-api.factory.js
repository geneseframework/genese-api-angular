"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_service_1 = require("../services/open-api.service");
var components_factory_1 = require("./components.factory");
var paths_factory_1 = require("./paths.factory");
var file_service_1 = require("../services/file.service");
var tools_service_1 = require("../services/tools.service");
/**
 * Factory of DataTypes and Endpoints with the genese-api.json file
 * Format of OpenApi objects : see https://swagger.io/specification/#oasObject
 */
var OpenApiFactory = /** @class */ (function () {
    function OpenApiFactory() {
        this.fileService = new file_service_1.FileService();
        this.openApiService = open_api_service_1.OpenApiService.getInstance(); // Instance of OpenApiService
    }
    /**
     * Starts the creation of the DataTypes and of the request services of genese-request.service.ts file
     */
    OpenApiFactory.prototype.init = function () {
        this.openApiService.openApi = { openapi: this.openApiService.openApiJsonFile.openapi };
        this.createEndpointsServices();
        this.createDatatypes();
        this.shakeTreeDatatypes();
    };
    /**
     * Creates the DataTypes
     */
    OpenApiFactory.prototype.createDatatypes = function () {
        this.openApiService.next(this.openApiService.openApiJsonFile, components_factory_1.ComponentsFactory);
    };
    /**
     * Creates the request services of genese-request.service.ts file
     */
    OpenApiFactory.prototype.createEndpointsServices = function () {
        this.openApiService.next(this.openApiService.openApiJsonFile, paths_factory_1.PathsFactory);
    };
    /**
     * Remove all datatype files which are not linked to any other datatype file or any endpoint
     */
    OpenApiFactory.prototype.shakeTreeDatatypes = function () {
        var _this = this;
        if (this.openApiService.datatypeNames) {
            this.openApiService.datatypeNames.forEach(function (name) {
                if (!_this.openApiService.refLinks.has(name)) {
                    var fileToDelete = "/genese/genese-api/datatypes/" + tools_service_1.toKebabCase(name) + ".datatype.ts";
                    _this.fileService.deleteFile(fileToDelete).then(function () {
                        console.log("WARNING: The Datatype OpenApi object " + name + " is not linked to any Datatype or endpoint. The file '" + tools_service_1.toKebabCase(name) + ".datatype.ts' has been deleted.");
                    });
                }
            });
        }
    };
    return OpenApiFactory;
}());
exports.OpenApiFactory = OpenApiFactory;
