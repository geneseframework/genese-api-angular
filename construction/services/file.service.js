"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var fse = require('fs-extra');
var appRootPath = require('app-root-path');
var FileService = /** @class */ (function () {
    function FileService() {
        this.appRoot = appRootPath.toString();
    }
    FileService.prototype.createFile = function (folder, name, data) {
        var pathFolder = this.appRoot + folder;
        fse.mkdirpSync(pathFolder);
        fse.writeFileSync(pathFolder + name, data);
    };
    FileService.prototype.readFile = function (path) {
        return fse.readFile(this.appRoot + path, 'utf-8');
    };
    FileService.prototype.getFileNameWithClassName = function (className) {
        var fileName = className.charAt(0).toLowerCase();
        for (var i = 1; i < className.length; i++) {
            if (className.charAt(i).toLowerCase() !== className.charAt(i)) {
                fileName += "-" + className.charAt(i).toLowerCase();
            }
            else {
                fileName += className.charAt(i);
            }
        }
        fileName = fileName.replace('_', '-');
        return fileName;
    };
    // ----------------------------------------------------------------------------
    //						Methods for OpenApi routes
    // ----------------------------------------------------------------------------
    FileService.prototype.getFileNameWithoutExtensionFromOpenApiRoute = function (schema) {
        var fileName = schema.slice(schema.indexOf('/') + 1)
            .replace('{', 'by-')
            .replace('}', '')
            .replace(/\//g, '-')
            .replace('_', '-');
        var className = schema.slice(schema.lastIndexOf('/') + 1);
        fileName = fileName.slice(0, fileName.lastIndexOf('-') + 1) + this.getFileNameWithClassName(className);
        return fileName;
    };
    FileService.prototype.getDataTypeNameFromRefSchema = function (refSchema) {
        return refSchema.slice(refSchema.lastIndexOf('/') + 1);
    };
    FileService.prototype.getClassNameFromOpenApiRoute = function (route) {
        var cleanedPath = route.charAt(0) === '/' ? route.slice(1) : route;
        cleanedPath = cleanedPath.replace('{', '');
        cleanedPath = cleanedPath.replace('}', '');
        var splittedFileName = cleanedPath.split('/');
        var className = tools_1.Tools.capitalize(splittedFileName[0]);
        for (var i = 1; i < splittedFileName.length; i++) {
            className += tools_1.Tools.capitalize(splittedFileName[i]);
        }
        return className;
    };
    return FileService;
}());
exports.FileService = FileService;
