"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_service_1 = require("../../services/config.service");
var warning_1 = require("./warning");
/**
 * This class contains all elements defining a class :
 *      - imports
 *      - declaration
 *      - properties
 *      - constructor
 *      - methods
 *  This class also contains methods managing these different elements
 */
var ClassFile = /** @class */ (function () {
    function ClassFile() {
        this.i = config_service_1.Config.indentation; // Indentation of the repository
        this._constructorInstructions = ''; // Body of the constructor
        this._constructorParams = ''; // Params of the constructor
        this._constructorPart = ''; // Part of the file containing the constructor
        this._content = ''; // All content of the file
        this._declarationPart = ''; // Part of the file containing the declaration of the class
        this._endOfFilePart = '\r\n}\r\n'; // Part of the file containing the last lines of the file
        this._fileName = ''; // File name
        this._fileFolder = ''; // Folder containing the file
        this._importLines = []; // Array of lines which are on the imports
        this._methods = []; // Array of the methods of the class
        this._methodsPart = ''; // Part of the file containing the methods
        this._propertiesPart = "\r\n" + this.i; // Part of the file containing the properties
    }
    // ----------------------------------------------------------------------------
    //							Imports generation
    // ----------------------------------------------------------------------------
    /**
     * Add a line on the imports part
     * @param objectToImport    {string} object imported
     * @param from              {string} module or path where is the object to import
     */
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
        /**
         * Get the part "imports" of the file
         * @private
         */
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
    /**
     * Set the declaration part of the class
     * @param className
     * @param decorator
     */
    ClassFile.prototype.setClassDeclaration = function (className, decorator) {
        var firstLine = decorator ? "\r\n" + decorator + "\r\n" : '\r\n';
        this._declarationPart = firstLine + "export class " + className + " {\r\n\r\n";
        return this;
    };
    // ----------------------------------------------------------------------------
    //							Properties generation
    // ----------------------------------------------------------------------------
    /**
     * Adds a property to part "properties" of the class
     * @param line
     */
    ClassFile.prototype.addProperty = function (line) {
        if (line === void 0) { line = ''; }
        this._propertiesPart = "" + this._propertiesPart + line + "\r\n" + this.i;
    };
    // ----------------------------------------------------------------------------
    //							Constructor generation
    // ----------------------------------------------------------------------------
    /**
     * Adds a constructor to the class
     */
    ClassFile.prototype.setConstructorPart = function () {
        this._constructorPart = "\r\n" + this.i + "constructor(\r\n" + this.i + this.i + this._constructorParams + ") {\r\n" + this.i + this.i + this._constructorInstructions + "}\r\n";
    };
    /**
     * Adds a param to the constructor
     * @param param {string} the name of the param with its type and a comma at the end
     */
    ClassFile.prototype.addParamToConstructor = function (param) {
        if (param === void 0) { param = ''; }
        this._constructorParams = "" + this._constructorParams + param + "\r\n" + this.i + this.i;
        this.setConstructorPart();
    };
    // ----------------------------------------------------------------------------
    //							 Methods generation
    // ----------------------------------------------------------------------------
    /**
     * Set the part "methods" of the file with all the methods contained in the class
     */
    ClassFile.prototype.setMethodsPart = function () {
        this._methodsPart = '';
        for (var _i = 0, _a = this._methods; _i < _a.length; _i++) {
            var method = _a[_i];
            this._methodsPart += "\r\n\r\n\r\n" + this.i + method.stringify();
        }
    };
    /**
     * Adds a method to the class
     * @param method: {Method} the method to add
     */
    ClassFile.prototype.addMethod = function (method) {
        this._methods.push(method);
        this.setMethodsPart();
    };
    // ----------------------------------------------------------------------------
    //					    File name, Class name and Folder
    // ----------------------------------------------------------------------------
    /**
     * Sets the name of the file
     * @param fileName
     */
    ClassFile.prototype.setFileName = function (fileName) {
        this._fileName = fileName;
        return this;
    };
    Object.defineProperty(ClassFile.prototype, "fileName", {
        /**
         * Gets the name of the file
         */
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the folder of the file
     * @param pathFolder
     */
    ClassFile.prototype.setFolder = function (pathFolder) {
        this._fileFolder = pathFolder;
        return this;
    };
    Object.defineProperty(ClassFile.prototype, "folder", {
        /**
         * Gets the folder of the file
         */
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
        /**
         * Gets the content of the file
         */
        get: function () {
            this._content = "" + warning_1.WARNING_GENERATED_CODE + this._importsPart + this._declarationPart + this._propertiesPart +
                ("" + this._constructorPart + this._methodsPart + this._endOfFilePart);
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    return ClassFile;
}());
exports.ClassFile = ClassFile;
