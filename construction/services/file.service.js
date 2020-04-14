"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    FileService.prototype.updateFile = function (folder, name, data) {
        fse.writeFileSync(this.appRoot + folder + name, data);
    };
    FileService.prototype.readFile = function (path) {
        return fse.readFile(this.appRoot + path, 'utf-8');
    };
    FileService.prototype.deleteFile = function (path) {
        return fse.remove(this.appRoot + path);
    };
    return FileService;
}());
exports.FileService = FileService;
