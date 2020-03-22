"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_service_1 = require("../services/file.service");
var method_model_1 = require("../models/files/method.model");
var tools_1 = require("../services/tools");
var genese_request_service_factory_1 = require("./genese-request-service.factory");
var class_file_model_1 = require("../models/files/class-file.model");
var GetRequestFactory = /** @class */ (function () {
    function GetRequestFactory() {
        this.featureServiceFile = new class_file_model_1.ClassFile();
        // private className = '';
        this.classNameService = '';
        // private content = '';
        this.fileService = new file_service_1.FileService();
        this.method = new method_model_1.Method();
        this.observableType = '';
        this.route = '';
    }
    GetRequestFactory.prototype.create = function (route, content) {
        this.route = route;
        this.featureServiceFile
            .setFileName(this.fileService.getFileNameWithoutExtensionFromOpenApiRoute(route))
            .setClassName(this.fileService.getClassNameFromOpenApiRoute(route) + "Service")
            .setClassDeclaration(this.featureServiceFile.className, '@Injectable()');
        this.addImports();
        this.addDeclaration();
        this.addConstructor();
        for (var _i = 0, _a = Object.keys(content); _i < _a.length; _i++) {
            var mediaType = _a[_i];
            this.addMediaTypes(content[mediaType]);
        }
        this.fileService.createFile('/genese/genese-api/services/', this.featureServiceFile.fileName + ".service.ts", this.featureServiceFile.content);
        this.addMethodToGeneseRequestService();
    };
    // public create(route: string, content: Content) {
    // 	this.route = route;
    // 	this.featureService.setFileName(this.fileService.getFileNameWithoutExtensionFromOpenApiRoute(route))
    // 	this.setFileName();
    // 	this.setClassName();
    // 	this.addImports();
    // 	this.addDeclaration();
    // 	this.addConstructor();
    // 	this.featureService.setClassDeclaration(this.classNameService, '@Injectable()');
    // 	for (const mediaType of Object.keys(content)) {
    // 		this.addMediaTypes(content[mediaType]);
    // 	}
    // 	this.fileService.createFile('/genese/genese-api/services/', `${this.featureService.fileName}.service.ts`, this.featureService.getContent());
    // 	this.addMethodToGeneseRequestService();
    // }
    GetRequestFactory.prototype.addImports = function () {
        this.featureServiceFile.addImport('Observable', 'rxjs');
        this.featureServiceFile.addImport('HttpClient', '@angular/common/http');
        this.featureServiceFile.addImport('Injectable', '@angular/core');
        this.featureServiceFile.addImport('GeneseEnvironmentService, GeneseService', 'genese-angular');
    };
    GetRequestFactory.prototype.addDeclaration = function () {
        this.featureServiceFile.setClassDeclaration(this.classNameService, '@Injectable()');
    };
    GetRequestFactory.prototype.addConstructor = function () {
        this.featureServiceFile.addParamToConstructor("private http: HttpClient,");
        this.featureServiceFile.addParamToConstructor("private geneseEnvironmentService: GeneseEnvironmentService,");
        this.featureServiceFile.addParamToConstructor("private geneseService: GeneseService,");
    };
    GetRequestFactory.prototype.addMethod = function (geneseMethod, dtoName) {
        this.method.name = "" + geneseMethod + this.featureServiceFile.className;
        this.method.setDeclaration(this.method.name, '', "Observable<" + this.observableType + ">");
        this.featureServiceFile.addMethod(this.method);
        var returnLine = "return this.geneseService.getGeneseInstance(" + dtoName + ")." + geneseMethod + "Custom('" + this.route + "') as any;";
        this.featureServiceFile.addLineToMethod(this.method.name, returnLine);
        this.featureServiceFile.addImport(dtoName, "../dtos/" + this.fileService.getFileNameWithClassName(dtoName) + ".dto");
    };
    GetRequestFactory.prototype.addMediaTypes = function (mediaType) {
        if (mediaType.schema) {
            this.getReferenceOrSchema(mediaType.schema);
        }
    };
    GetRequestFactory.prototype.getReferenceOrSchema = function (schema) {
        if (schema['$ref']) {
            this.getReference(schema['$ref']);
        }
        else if (schema['type']) {
            this.getRootSchema(schema);
        }
    };
    GetRequestFactory.prototype.getReference = function (referenceSchema) {
        this.observableType = this.getDtoName(referenceSchema);
        this.addMethod('get', this.getDtoName(referenceSchema));
    };
    GetRequestFactory.prototype.getRootSchema = function (rootSchema) {
        switch (rootSchema.type) {
            case 'array':
                if (rootSchema.items) {
                    if (rootSchema.items.$ref) {
                        this.observableType = this.getDtoName(this.getDtoName(rootSchema.items.$ref) + "[]");
                        this.addMethod('get', this.getDtoName(rootSchema.items.$ref));
                    }
                }
                break;
            default: { }
        }
    };
    GetRequestFactory.prototype.getDtoName = function (referenceSchema) {
        var splittedReferenceSchema = referenceSchema.split('/');
        return splittedReferenceSchema[splittedReferenceSchema.length - 1];
    };
    GetRequestFactory.prototype.addMethodToGeneseRequestService = function () {
        var geneseRequestService = genese_request_service_factory_1.GeneseRequestServiceFactory.getInstance().classFile;
        geneseRequestService.addImport(this.observableType, "../dtos/" + this.observableType);
        geneseRequestService.addLineToMethod('init', "this." + this.method.name + " = this." + tools_1.Tools.unCapitalize(this.classNameService) + "." + this.method.name + ";");
        geneseRequestService.addProperty("public " + this.method.name + ": () => Observable<" + this.observableType + ">;");
        this.fileService.createFile("/genese/genese-api/services/", "genese-request.service.ts", geneseRequestService.content);
    };
    return GetRequestFactory;
}());
exports.GetRequestFactory = GetRequestFactory;
