"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * OpenApi object
 * See https://swagger.io/specification/#requestBodyObject
 */
var Content = /** @class */ (function () {
    function Content() {
    }
    return Content;
}());
exports.Content = Content;
var CONTENT_TYPE;
(function (CONTENT_TYPE) {
    CONTENT_TYPE["ALL"] = "*/*";
    CONTENT_TYPE["JSON"] = "application/json";
    CONTENT_TYPE["MEDIA"] = "multipart/form-data";
    CONTENT_TYPE["TEXT_PLAIN"] = "text/plain";
    CONTENT_TYPE["TEXT_HTML"] = "text/html";
    CONTENT_TYPE["XML"] = "application/xml";
})(CONTENT_TYPE = exports.CONTENT_TYPE || (exports.CONTENT_TYPE = {}));
