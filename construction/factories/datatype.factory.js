"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_service_1 = require("../services/file.service");
var class_file_model_1 = require("../models/files/class-file.model");
var DatatypeFactory = /** @class */ (function () {
    function DatatypeFactory() {
        this.classFile = new class_file_model_1.ClassFile();
        this.fileService = new file_service_1.FileService();
    }
    DatatypeFactory.prototype.create = function (dataTypeName, schema) {
        this.classFile
            .setFileName(this.fileService.getFileNameWithClassName(dataTypeName) + ".datatype.ts")
            .setFolder("/genese/genese-api/datatypes/")
            .setClassDeclaration(dataTypeName);
        this.addPropertiesAndImports(dataTypeName, schema);
        this.fileService.createFile(this.classFile.folder, this.classFile.fileName, this.classFile.content);
    };
    DatatypeFactory.prototype.addPropertiesAndImports = function (dataTypeName, schema) {
        if (schema.properties) {
            for (var _i = 0, _a = Object.keys(schema.properties); _i < _a.length; _i++) {
                var propertyName = _a[_i];
                this.classFile.addProperty("public " + propertyName + " ?= " + this.addDefaultValueAndImport(dataTypeName, schema.properties[propertyName]) + ";");
            }
        }
        else if (schema.enum) {
            // TODO
        }
    };
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
                    var dataTypeName_1 = this.fileService.getDataTypeNameFromRefSchema(property['$ref']);
                    this.classFile.addImport(dataTypeName_1, "./" + this.fileService.getFileNameWithClassName(dataTypeName_1) + ".datatype");
                    return "new " + dataTypeName_1 + "()";
                }
                else {
                    return '\'\'';
                }
            }
        }
    };
    DatatypeFactory.prototype.getDefaultValueArrays = function (dataTypeName, property) {
        var defaultValue = '[';
        if (property && property.items) {
            defaultValue += this.addDefaultValueAndImport(dataTypeName, property.items);
        }
        defaultValue += ']';
        return defaultValue;
    };
    return DatatypeFactory;
}());
exports.DatatypeFactory = DatatypeFactory;
