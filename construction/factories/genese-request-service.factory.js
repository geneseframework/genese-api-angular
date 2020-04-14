"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var class_file_model_1 = require("../models/files/class-file.model");
var GeneseRequestServiceFactory = /** @class */ (function () {
    function GeneseRequestServiceFactory() {
        this.classFile = new class_file_model_1.ClassFile(); // The ClassFile object which will be used to create the genese-request-service.ts file
    }
    /**
     * Singleton pattern : get instance of GeneseRequestServiceFactory
     */
    GeneseRequestServiceFactory.getInstance = function () {
        if (!GeneseRequestServiceFactory.instance) {
            GeneseRequestServiceFactory.instance = new GeneseRequestServiceFactory();
        }
        return GeneseRequestServiceFactory.instance;
    };
    /**
     * Starts the construction of the genese-request-service.ts file
     */
    GeneseRequestServiceFactory.prototype.init = function () {
        this.addImports()
            .addDeclaration()
            .addConstructor();
    };
    /**
     * Adds the imports of the GeneseRequestService class
     */
    GeneseRequestServiceFactory.prototype.addImports = function () {
        this.classFile.addImport('Observable', 'rxjs');
        this.classFile.addImport('HttpClient', '@angular/common/http');
        this.classFile.addImport('Injectable', '@angular/core');
        this.classFile.addImport('GeneseService, RequestOptions', 'genese-angular');
        return this;
    };
    /**
     * Adds the declaration of the GeneseRequestService class
     */
    GeneseRequestServiceFactory.prototype.addDeclaration = function () {
        this.classFile.setClassDeclaration('GeneseRequestService', '@Injectable()');
        return this;
    };
    /**
     * Adds the constructor of the GeneseRequestService class
     */
    GeneseRequestServiceFactory.prototype.addConstructor = function () {
        this.classFile.addParamToConstructor("private http: HttpClient,");
        this.classFile.addParamToConstructor("private geneseService: GeneseService");
    };
    return GeneseRequestServiceFactory;
}());
exports.GeneseRequestServiceFactory = GeneseRequestServiceFactory;
