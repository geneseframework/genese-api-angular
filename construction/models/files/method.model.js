"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_service_1 = require("../../services/config.service");
/**
 * Method of a ClassFile
 */
var Method = /** @class */ (function () {
    function Method() {
        this.i = config_service_1.Config.indentation; // Indentation by default
        this.declaration = ''; // Declaration of the method
        this.body = ''; // Body of the method
        this.end = this.i + "}"; // Last line of the method
        this.name = ''; // Name of the method
        this.params = ''; // Parameters of the method
        this.type = ''; // Type of the method
    }
    /**
     * Sets the declaration of the method
     * @param name
     * @param params
     * @param type
     */
    Method.prototype.setDeclaration = function (name, params, type) {
        if (params === void 0) { params = ''; }
        if (type === void 0) { type = 'void'; }
        this.declaration = name + "(" + params + "): " + type + " {\r\n";
    };
    /**
     * Set the name, the parameters and the type of the method
     * @param declaration
     */
    Method.prototype.setNameParamsType = function (declaration) {
        if (declaration === void 0) { declaration = ''; }
        this.name = declaration.slice(0, declaration.indexOf('('));
        this.params = declaration.slice(declaration.indexOf('(') + 1, declaration.indexOf(')'));
        this.type = declaration.slice(declaration.indexOf(':') + 2, declaration.indexOf('{') - 1);
    };
    /**
     * Add a new line to the method
     * @param line
     */
    Method.prototype.addLine = function (line) {
        this.body = this.body ? "" + this.body + this.i + line : "" + this.i + this.i + line;
        return this;
    };
    /**
     * Returns the complete code of the method as string
     */
    Method.prototype.stringify = function () {
        return "" + this.declaration + this.body + "\r\n" + this.end + "\r\n";
    };
    return Method;
}());
exports.Method = Method;
