"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_service_1 = require("../services/file.service");
var method_model_1 = require("../models/files/method.model");
var class_file_model_1 = require("../models/files/class-file.model");
var GeneseRequestServiceFactory = /** @class */ (function () {
    function GeneseRequestServiceFactory() {
        this.classFile = new class_file_model_1.ClassFile();
        this.fileService = new file_service_1.FileService();
    }
    GeneseRequestServiceFactory.getInstance = function () {
        if (!GeneseRequestServiceFactory.instance) {
            GeneseRequestServiceFactory.instance = new GeneseRequestServiceFactory();
        }
        return GeneseRequestServiceFactory.instance;
    };
    GeneseRequestServiceFactory.prototype.init = function () {
        this.addImports();
        this.addDeclaration();
        this.addConstructor();
        this.addMethods();
        // return this.classFile.getContent();
        // this.fileService.createFile(`/genese/genese-api/services/genese-request.service.ts`, this.classFile.getContent());
    };
    GeneseRequestServiceFactory.prototype.addDeclaration = function () {
        this.classFile.setClassDeclaration('GeneseRequestService', '@Injectable()');
    };
    GeneseRequestServiceFactory.prototype.addImports = function () {
        this.classFile.addImport('Observable', 'rxjs');
        this.classFile.addImport('HttpClient', '@angular/common/http');
        this.classFile.addImport('Injectable', '@angular/core');
        this.classFile.addImport('GeneseEnvironmentService', 'genese-angular');
    };
    GeneseRequestServiceFactory.prototype.addConstructor = function () {
        this.classFile.addParamToConstructor("private http: HttpClient,");
        this.classFile.addParamToConstructor("private geneseEnvironmentService: GeneseEnvironmentService,");
        this.classFile.addInstructionToConstructor("this.init();");
    };
    GeneseRequestServiceFactory.prototype.addMethods = function () {
        var method = new method_model_1.Method();
        method.setDeclaration('init');
        this.classFile.addMethod(method);
    };
    return GeneseRequestServiceFactory;
}());
exports.GeneseRequestServiceFactory = GeneseRequestServiceFactory;
