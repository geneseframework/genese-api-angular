"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fse = require('fs-extra');
var appRootPath = require('app-root-path');
/**
 * The editor configuration
 */
var Config = /** @class */ (function () {
    function Config() {
    }
    /**
     * Singleton pattern
     */
    Config.getInstance = function () {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    };
    /**
     * Returns the editor configuration (just indentation for now)
     */
    Config.prototype.setConfig = function () {
        return this.setIndentation();
    };
    /**
     * Sets the indentation by default with the .editorconfig file
     */
    Config.prototype.setIndentation = function () {
        var appRoot = appRootPath.toString();
        var indent_style = '';
        var size = 1;
        var indentation = '';
        return fse.readFile(appRoot + "/.editorconfig").then(function (contentFile) {
            var _a;
            var lines = contentFile.toString().split("\n");
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                if (line.indexOf('indent_style') > -1) {
                    indent_style = line.indexOf('space') > -1 ? ' ' : '\t';
                }
                if (line.indexOf('indent_size') > -1) {
                    size = Number((_a = line.split('=')) === null || _a === void 0 ? void 0 : _a[1].trim());
                }
            }
            if (indent_style && size) {
                for (var i = 0; i < size; i++) {
                    indentation = "" + indentation + indent_style;
                }
            }
            Config.indentation = indentation;
            return;
        }).catch(function (e) {
            console.log('WARNING : get indentation from .editorconfig failed. ', e);
            return '    ';
        });
    };
    Config.indentation = '    '; // Indentation style
    return Config;
}());
exports.Config = Config;
