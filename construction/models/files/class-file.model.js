"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClassFile = /** @class */ (function () {
    function ClassFile() {
        this._className = '';
        this._constructorInstructions = '';
        this._constructorParams = '';
        this._constructorPart = '';
        this._content = '';
        this._declarationPart = '';
        this._endOfFilePart = '\r\n}\r\n';
        this._fileName = '';
        this._fileFolder = '';
        this._importLines = [];
        this._methods = [];
        this._methodsPart = '';
        this._propertiesPart = '\r\n\t';
    }
    // ----------------------------------------------------------------------------
    //							Imports generation
    // ----------------------------------------------------------------------------
    ClassFile.prototype.addImport = function (objectToImport, from) {
        var existingFrom = this._importLines.find(function (e) { return e.from === from; });
        if (existingFrom) {
            if (!existingFrom.objectsToImport.includes(objectToImport)) {
                this._importLines[this._importLines.findIndex(function (e) { return e.from === from; })].objectsToImport.push(objectToImport);
            }
        }
        else {
            this._importLines.push({ objectsToImport: [objectToImport], from: from });
        }
    };
    Object.defineProperty(ClassFile.prototype, "_importsPart", {
        get: function () {
            var importsPart = '';
            for (var _i = 0, _a = this._importLines; _i < _a.length; _i++) {
                var importLine = _a[_i];
                var objectsToImport = '';
                for (var _b = 0, _c = importLine.objectsToImport; _b < _c.length; _b++) {
                    var objectToImport = _c[_b];
                    objectsToImport = "" + objectsToImport + objectToImport + ", ";
                }
                objectsToImport = objectsToImport.slice(0, objectsToImport.length - 2);
                importsPart = importsPart + "import { " + objectsToImport + " } from '" + importLine.from + "';\r\n";
            }
            return importsPart;
        },
        enumerable: true,
        configurable: true
    });
    // ----------------------------------------------------------------------------
    //							Declaration generation
    // ----------------------------------------------------------------------------
    ClassFile.prototype.setClassDeclaration = function (className, decorator) {
        var firstLine = decorator ? "\r\n" + decorator + "\r\n" : '\r\n';
        this._declarationPart = firstLine + "export class " + className + " {\r\n\r\n";
        return this;
    };
    // ----------------------------------------------------------------------------
    //							Properties generation
    // ----------------------------------------------------------------------------
    ClassFile.prototype.addProperty = function (line) {
        if (line === void 0) { line = ''; }
        this._propertiesPart = "" + this._propertiesPart + line + "\r\n\t";
    };
    // ----------------------------------------------------------------------------
    //							Constructor generation
    // ----------------------------------------------------------------------------
    ClassFile.prototype.setConstructorPart = function () {
        this._constructorPart = "\r\n\tconstructor(\r\n\t\t" + this._constructorParams + ") {\r\n\t\t" + this._constructorInstructions + "}\r\n";
    };
    ClassFile.prototype.addInstructionToConstructor = function (line) {
        if (line === void 0) { line = ''; }
        this._constructorInstructions = "" + this._constructorInstructions + line + "\r\n\t";
        this.setConstructorPart();
    };
    ClassFile.prototype.addParamToConstructor = function (param) {
        if (param === void 0) { param = ''; }
        this._constructorParams = "" + this._constructorParams + param + "\r\n\t\t";
        this.setConstructorPart();
    };
    // ----------------------------------------------------------------------------
    //							 Methods generation
    // ----------------------------------------------------------------------------
    ClassFile.prototype.setMethodsPart = function () {
        this._methodsPart = '';
        for (var _i = 0, _a = this._methods; _i < _a.length; _i++) {
            var method = _a[_i];
            this._methodsPart += "\r\n\r\n\r\n\t" + method.stringify();
        }
    };
    ClassFile.prototype.addMethod = function (method) {
        this._methods.push(method);
        this.setMethodsPart();
    };
    ClassFile.prototype.addLineToMethod = function (methodName, line) {
        var method = this._methods.find(function (e) { return e.name === methodName; });
        if (method) {
            method.body = method.body ? method.body + "\t" + line : "\t\t" + line;
        }
        this.setMethodsPart();
    };
    // ----------------------------------------------------------------------------
    //					    File name, Class name and Folder
    // ----------------------------------------------------------------------------
    ClassFile.prototype.setFileName = function (fileName) {
        this._fileName = fileName;
        return this;
    };
    Object.defineProperty(ClassFile.prototype, "fileName", {
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    ClassFile.prototype.setClassName = function (className) {
        this._className = className;
        return this;
    };
    Object.defineProperty(ClassFile.prototype, "className", {
        get: function () {
            return this._className;
        },
        enumerable: true,
        configurable: true
    });
    ClassFile.prototype.setFolder = function (pathFolder) {
        this._fileFolder = pathFolder;
        return this;
    };
    Object.defineProperty(ClassFile.prototype, "folder", {
        get: function () {
            return this._fileFolder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassFile.prototype, "content", {
        // ----------------------------------------------------------------------------
        //							File content
        // ----------------------------------------------------------------------------
        get: function () {
            this._content = "" + this._importsPart + this._declarationPart + this._propertiesPart +
                ("" + this._constructorPart + this._methodsPart + this._endOfFilePart);
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    return ClassFile;
}());
exports.ClassFile = ClassFile;
