"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_service_1 = require("../services/file.service");
var class_file_model_1 = require("../models/files/class-file.model");
var tools_service_1 = require("../services/tools.service");
var open_api_service_1 = require("../services/open-api.service");
/**
 * Factory of DataType files
 */
var DatatypeFactory = /** @class */ (function () {
    function DatatypeFactory() {
        this.classFile = new class_file_model_1.ClassFile(); // File object which will be used to construct the file
        this.fileService = new file_service_1.FileService(); // Service managing files
        this.openApiService = open_api_service_1.OpenApiService.getInstance(); // Instance of OpenApiService
    }
    /**
     * Create DataType file for a given name and a given OpenApiSchema
     * @param dataTypeName
     * @param schema
     */
    DatatypeFactory.prototype.create = function (dataTypeName, schema) {
        this.openApiService.addDatatypeName(dataTypeName);
        this.classFile
            .setFileName(tools_service_1.toKebabCase(dataTypeName) + ".datatype.ts")
            .setFolder("/genese/genese-api/datatypes/")
            .setClassDeclaration(dataTypeName);
        this.addPropertiesAndImports(dataTypeName, schema);
        this.openApiService.addDatatypeName(dataTypeName);
        this.fileService.createFile(this.classFile.folder, this.classFile.fileName, this.classFile.content);
    };
    /**
     * Adds properties and imports to the datatype file
     * @param dataTypeName
     * @param schema
     */
    DatatypeFactory.prototype.addPropertiesAndImports = function (dataTypeName, schema) {
        if (schema.properties) {
            for (var _i = 0, _a = Object.keys(schema.properties); _i < _a.length; _i++) {
                var propertyName = _a[_i];
                this.classFile.addProperty("public " + propertyName + " ?= " + this.addDefaultValueAndImport(dataTypeName, schema.properties[propertyName]) + ";");
            }
        }
    };
    /**
     * Adds a default value to a given property (mandatory for genese-angular module)
     * Adds corresponding imports
     * @param dataTypeName
     * @param property
     */
    DatatypeFactory.prototype.addDefaultValueAndImport = function (dataTypeName, property) {
        switch (property.type) {
            case 'array':
                return this.getDefaultValueArrays(dataTypeName, property);
            case 'boolean':
                return 'false';
            case 'integer':
            case 'number':
                return '0';
            case 'string':
                return '\'\'';
            default: {
                if (property['$ref']) {
                    var dTname = tools_service_1.getDataTypeNameFromRefSchema(property['$ref']);
                    this.classFile.addImport(dTname, "./" + tools_service_1.toKebabCase(dTname) + ".datatype");
                    this.openApiService.addRefLinks(dTname);
                    return "new " + dTname + "()";
                }
                else {
                    return '\'\'';
                }
            }
        }
    };
    /**
     * Adds default values for properties with type 'array' (mandatory for genese-angular module)
     * @param dataTypeName
     * @param property
     */
    DatatypeFactory.prototype.getDefaultValueArrays = function (dataTypeName, property) {
        var _a, _b;
        var defaultValue = '[';
        if (property === null || property === void 0 ? void 0 : property.items) {
            defaultValue += this.addDefaultValueAndImport(dataTypeName, property.items);
            if ((_a = property.items) === null || _a === void 0 ? void 0 : _a.$ref) {
                this.openApiService.addRefLinks(tools_service_1.getDataTypeNameFromRefSchema((_b = property.items) === null || _b === void 0 ? void 0 : _b.$ref));
            }
        }
        defaultValue += ']';
        return defaultValue;
    };
    return DatatypeFactory;
}());
exports.DatatypeFactory = DatatypeFactory;
