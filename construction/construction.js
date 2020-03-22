"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_api_factory_1 = require("./factories/open-api.factory");
var genese_request_service_factory_1 = require("./factories/genese-request-service.factory");
var fse = require('fs-extra');
var appRootPath = require('app-root-path');
var Construction = /** @class */ (function () {
    function Construction() {
        this.appRoot = appRootPath.toString();
        this.openApiFactory = new open_api_factory_1.OpenApiFactory();
        this.geneseRequestServiceFactory = genese_request_service_factory_1.GeneseRequestServiceFactory.getInstance();
    }
    Construction.prototype.startConstruction = function () {
        this.createFolders();
        this.createGeneseRequestService();
        this.createEndpointsServicesAndDataTypes();
    };
    Construction.prototype.createFolders = function () {
        fse.removeSync(this.appRoot + '/genese');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/datatypes');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/services');
    };
    Construction.prototype.createEndpointsServicesAndDataTypes = function () {
        this.openApiFactory.init();
    };
    Construction.prototype.createGeneseRequestService = function () {
        this.geneseRequestServiceFactory.init();
    };
    return Construction;
}());
exports.Construction = Construction;
