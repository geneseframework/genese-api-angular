"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_factory_1 = require("./factories/open-api.factory");
var genese_request_service_factory_1 = require("./factories/genese-request-service.factory");
var config_service_1 = require("./services/config.service");
var fse = require('fs-extra');
var appRootPath = require('app-root-path');
var Construction = /** @class */ (function () {
    function Construction() {
        this.appRoot = appRootPath.toString(); // Path to the root of the app
        this.config = new config_service_1.Config(); // Config from .editorconfig file
        this.openApiFactory = new open_api_factory_1.OpenApiFactory(); // Factory for the datatypes files
    }
    /**
     * Starts the code generation
     */
    Construction.prototype.startConstruction = function () {
        var _this = this;
        this.getConfig().then(function () {
            _this.geneseRequestServiceFactory = genese_request_service_factory_1.GeneseRequestServiceFactory.getInstance();
            _this.createFolders();
            _this.createGeneseRequestService();
            _this.createEndpointsServicesAndDataTypes();
        });
    };
    /**
     * Get editor config from .editorconfig file
     */
    Construction.prototype.getConfig = function () {
        return this.config.setConfig();
    };
    /**
     * Creates the genese-api folders
     */
    Construction.prototype.createFolders = function () {
        fse.removeSync(this.appRoot + '/genese');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/datatypes');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/services');
    };
    /**
     * Creates the genese-request.service.ts file
     */
    Construction.prototype.createGeneseRequestService = function () {
        this.geneseRequestServiceFactory.init();
    };
    /**
     * Parses the genese-api.json file in order to :
     *     - parse the datatypes of the json file in order to create the datatype.ts files
     *     - parse the endpoint paths in order to add methods to genese-request.service.ts file
     */
    Construction.prototype.createEndpointsServicesAndDataTypes = function () {
        this.openApiFactory.init();
    };
    return Construction;
}());
exports.Construction = Construction;
