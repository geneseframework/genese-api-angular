"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemas_1 = require("./schemas");
var responses_1 = require("./responses");
var parameters_1 = require("./parameters");
var examples_1 = require("./examples");
var request_body_1 = require("./request-body");
var header_1 = require("./header");
var Components = /** @class */ (function () {
    function Components() {
        this.examples = new examples_1.Examples();
        this.headers = { gnMap: new header_1.Header() };
        this.parameters = new parameters_1.Parameters();
        this.requestBodies = { gnMap: new request_body_1.RequestBody() };
        this.responses = new responses_1.Responses();
        this.schemas = new schemas_1.Schemas();
    }
    return Components;
}());
exports.Components = Components;
