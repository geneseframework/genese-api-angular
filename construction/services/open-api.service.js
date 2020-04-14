"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appRootPath = require('app-root-path');
/**
 * Services for the genese-api.json file and for parsing the OpenApi structure
 */
var OpenApiService = /** @class */ (function () {
    function OpenApiService() {
        this.openApi = {}; // Empty OpenApi structure which will contain all the elements coming from the genese-api.json file
        this.appRoot = appRootPath.toString(); // Root of the app
        this._datatypeNames = new Set(); // Set of names of DataType files
        this._openApiJsonFile = {}; // The content of the genese-api.json file
        this._refLinks = new Set(); // Set of $ref links in endpoint schemas or in OpenApi Datatype objects
        this._openApiJsonFile = require(this.appRoot + '/genese-api.json');
    }
    /**
     * Singleton instance of this service
     */
    OpenApiService.getInstance = function () {
        if (!OpenApiService.instance) {
            OpenApiService.instance = new OpenApiService();
        }
        return OpenApiService.instance;
    };
    Object.defineProperty(OpenApiService.prototype, "openApiJsonFile", {
        /**
         * get the content of genese-api.json file as OpenApi object
         */
        get: function () {
            return this._openApiJsonFile;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method used for parsing the OpenApi structure
     * Ex : OpenApiFactory => ComponentsFactory => SchemasFactory => ...
     *
     * @param target {object}                   // content to send to the next step (a Component, a Schema, ...)
     * @param propertyClass {TConstructor<T>}   // class of the next step (ComponentsFactory, SchemasFactory,...)
     * @param options                           // other information to send to the next step
     */
    OpenApiService.prototype.next = function (target, propertyClass, options) {
        if (target && propertyClass) {
            var nextPropertyClassObject = new propertyClass();
            if (options) {
                nextPropertyClassObject['init'](target, options);
            }
            else {
                nextPropertyClassObject['init'](target);
            }
        }
    };
    Object.defineProperty(OpenApiService.prototype, "datatypeNames", {
        // ----------------------------------------------------------------------------
        //					            Datatype services
        // ----------------------------------------------------------------------------
        get: function () {
            return this._datatypeNames;
        },
        enumerable: true,
        configurable: true
    });
    OpenApiService.prototype.addDatatypeName = function (datatypeName) {
        this._datatypeNames.add(datatypeName);
    };
    Object.defineProperty(OpenApiService.prototype, "refLinks", {
        get: function () {
            return this._refLinks;
        },
        enumerable: true,
        configurable: true
    });
    OpenApiService.prototype.addRefLinks = function (refLink) {
        this._refLinks.add(refLink);
    };
    return OpenApiService;
}());
exports.OpenApiService = OpenApiService;
