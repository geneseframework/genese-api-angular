"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Method = /** @class */ (function () {
    function Method() {
        this.declaration = '';
        this.body = '';
        this.end = '\t}';
        this.name = '';
        this.params = '';
        this.type = '';
    }
    Method.prototype.setDeclaration = function (name, params, type) {
        if (params === void 0) { params = ''; }
        if (type === void 0) { type = 'void'; }
        this.declaration = name + "(" + params + "): " + type + " {\r\n";
    };
    Method.prototype.setNameParamsType = function (declaration) {
        if (declaration === void 0) { declaration = ''; }
        this.name = declaration.slice(0, declaration.indexOf('('));
        this.params = declaration.slice(declaration.indexOf('(') + 1, declaration.indexOf(')'));
        this.type = declaration.slice(declaration.indexOf(':') + 2, declaration.indexOf('{') - 1);
    };
    Method.prototype.stringify = function () {
        return "" + this.declaration + this.body + "\r\n" + this.end + "\r\n";
    };
    return Method;
}());
exports.Method = Method;
