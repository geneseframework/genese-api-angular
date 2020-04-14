"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_service_1 = require("../services/file.service");
var method_model_1 = require("../models/files/method.model");
var genese_request_service_factory_1 = require("./genese-request-service.factory");
var class_file_model_1 = require("../models/files/class-file.model");
var request_method_enum_1 = require("../models/requests/request-method.enum");
var tools_service_1 = require("../services/tools.service");
var genese_method_enum_1 = require("../models/requests/genese-method.enum");
var path_item_1 = require("../models/open-api/path-item");
var request_side_enum_1 = require("../models/requests/request-side.enum");
var endpoint_model_1 = require("../models/files/endpoint.model");
var open_api_service_1 = require("../services/open-api.service");
/**
 * Factory of CRUD methods in order to add them into genese-request.service.ts file
 */
var RequestMethodFactory = /** @class */ (function () {
    /**
     * Sets geneseRequestService with Singleton instance
     */
    function RequestMethodFactory() {
        this.action = request_method_enum_1.RequestMethod.GET; // The action verb of the http request
        this.clientSide = {}; // The properties of the client side of the request (body, ...)
        this.endpoint = ''; // The endpoint path of the request
        this.fileService = new file_service_1.FileService(); // The service managing files
        this.geneseRequestService = new class_file_model_1.ClassFile(); // The content of genese-request.service.ts file (as ClassFile object)
        this.method = new method_model_1.Method(); // The CRUD method to add
        this.pathItem = new path_item_1.PathItem(); // The PathItem containing the endpoint
        this.serverSide = {}; // The properties of the server side of the request (response, ...)
        this.openApiService = open_api_service_1.OpenApiService.getInstance();
        this.geneseRequestService = genese_request_service_factory_1.GeneseRequestServiceFactory.getInstance().classFile;
    }
    /**
     * Algorithm of the creation of CRUD method
     * @param action
     * @param endpoint
     * @param pathItem
     */
    RequestMethodFactory.prototype.addRequestMethod = function (action, endpoint, pathItem) {
        this.init(action, endpoint, pathItem)
            .addNameAndParamsToMethod()
            .getContentsFromPathItem()
            .addProperties(request_side_enum_1.RequestSide.CLIENT)
            .addProperties(request_side_enum_1.RequestSide.SERVER)
            .getGeneseMethod()
            .addMethodToGeneseRequestService()
            .updateGeneseRequestService();
    };
    // ----------------------------------------------------------------------------
    //		      Creates request method and get contents from pathItem
    // ----------------------------------------------------------------------------
    /**
     * Initialize the properties action, endpoint and pathItem
     * This is mandatory to be able to use chained methods (returning 'this')
     * @param action
     * @param endpoint
     * @param pathItem
     */
    RequestMethodFactory.prototype.init = function (action, endpoint, pathItem) {
        this.action = action;
        this.endpoint = endpoint;
        this.pathItem = pathItem;
        return this;
    };
    /**
     * Adds the name and the parameters to the method
     */
    RequestMethodFactory.prototype.addNameAndParamsToMethod = function () {
        var methodName = '';
        var params = '';
        var splittedEndpoint = this.endpoint.split('/');
        if (splittedEndpoint.length > 0) {
            for (var i = 1; i < splittedEndpoint.length; i++) {
                if (splittedEndpoint[i].charAt(0) === '{') {
                    var path = splittedEndpoint[i].slice(1, -1);
                    var param = tools_service_1.toCamelCase(path);
                    methodName = methodName + "By" + tools_service_1.capitalize(param);
                    params = params + ", " + param + " = ''";
                }
                else {
                    methodName = "" + methodName + tools_service_1.capitalize(splittedEndpoint[i]);
                }
            }
        }
        this.method.name = "" + this.action.toLowerCase() + methodName;
        this.method.params = params ? tools_service_1.unCapitalize(params.slice(2)) + ", options?: RequestOptions" : "options?: RequestOptions";
        return this;
    };
    /**
     * Gets the OpenApi node 'content' for the client and the server side
     */
    RequestMethodFactory.prototype.getContentsFromPathItem = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        this.clientSide.content = (_c = (_b = (_a = this.pathItem) === null || _a === void 0 ? void 0 : _a[this.action.toLowerCase()]) === null || _b === void 0 ? void 0 : _b.requestBody) === null || _c === void 0 ? void 0 : _c['content'];
        this.serverSide.content = (_g = (_f = (_e = (_d = this.pathItem) === null || _d === void 0 ? void 0 : _d[this.action.toLowerCase()]) === null || _e === void 0 ? void 0 : _e.responses) === null || _f === void 0 ? void 0 : _f['200']) === null || _g === void 0 ? void 0 : _g['content'];
        return this;
    };
    // ----------------------------------------------------------------------------
    //		Add properties from client side and server side informations
    // ----------------------------------------------------------------------------
    /**
     * Adds properties to each request side (schema, refOrPrimitive, ...)
     * @param side
     */
    RequestMethodFactory.prototype.addProperties = function (side) {
        this.getSchemaFromContent(side)
            .addRefLinks(side)
            .getRefOrPrimitive(side)
            .getDataTypeNameFromRefSchema(side)
            .addImport(side);
        return this;
    };
    /**
     * Sets the schema for a given request side
     * @param side
     */
    RequestMethodFactory.prototype.getSchemaFromContent = function (side) {
        var _a, _b, _c, _d, _e, _f;
        var schema = (_d = (_c = (_b = (_a = this[side]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b['application/json']) === null || _c === void 0 ? void 0 : _c.schema) !== null && _d !== void 0 ? _d : (_f = (_e = this[side]) === null || _e === void 0 ? void 0 : _e['text/plain']) === null || _f === void 0 ? void 0 : _f.schema;
        this[side].schema = schema !== null && schema !== void 0 ? schema : { type: 'any' };
        return this;
    };
    RequestMethodFactory.prototype.addRefLinks = function (side) {
        var _a, _b, _c, _d, _e, _f;
        if (this[side].schema) {
            if ((_a = this[side].schema) === null || _a === void 0 ? void 0 : _a.$ref) {
                this.openApiService.addRefLinks(tools_service_1.getDataTypeNameFromRefSchema(this[side].schema.$ref));
            }
            else if (((_b = this[side].schema) === null || _b === void 0 ? void 0 : _b.type) === 'array' && ((_d = (_c = this[side].schema) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.$ref)) {
                this.openApiService.addRefLinks(tools_service_1.getDataTypeNameFromRefSchema((_f = (_e = this[side].schema) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.$ref));
            }
        }
        return this;
    };
    /**
     *     - Sets reference or primitive for a given request side
     *     - Adds dataTypeName to the set of DataType names
     * @param side  /  client or server side
     */
    RequestMethodFactory.prototype.getRefOrPrimitive = function (side) {
        var _a, _b, _c, _d, _e, _f;
        if (this[side].schema) {
            if ((_a = this[side].schema) === null || _a === void 0 ? void 0 : _a.$ref) {
                // this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema.$ref));
                this[side].refOrPrimitive = (_b = this[side].schema) === null || _b === void 0 ? void 0 : _b.$ref;
            }
            else {
                switch ((_c = this[side].schema) === null || _c === void 0 ? void 0 : _c.type) {
                    case 'array':
                        this[side].refOrPrimitive = (_e = (_d = this[side].schema) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e.$ref;
                        // if (this[side].schema?.items?.$ref) {
                        //     this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema.$ref));
                        // }
                        break;
                    case 'string':
                    case 'number':
                    case 'boolean':
                    case 'any':
                        this[side].refOrPrimitive = (_f = this[side].schema) === null || _f === void 0 ? void 0 : _f.type;
                        break;
                    default:
                        throw Error('Incorrect schema type');
                }
            }
        }
        return this;
    };
    /**
     * If necessary, adds import for a given request side
     * @param side
     */
    RequestMethodFactory.prototype.addImport = function (side) {
        if (this[side].dataTypeName && !tools_service_1.isPrimitiveType(this[side].dataTypeName) && this[side].refOrPrimitive !== 'any') {
            this.geneseRequestService.addImport(this[side].dataTypeName, "../datatypes/" + tools_service_1.toKebabCase(this[side].dataTypeName) + ".datatype");
        }
        return this;
    };
    /**
     * Gets the name of the DataType included in a reference of a schema
     * @param side
     */
    RequestMethodFactory.prototype.getDataTypeNameFromRefSchema = function (side) {
        this[side].dataTypeName = tools_service_1.getDataTypeNameFromRefSchema(this[side].refOrPrimitive);
        return this;
    };
    // ----------------------------------------------------------------------------
    //					   Add method to GeneseRequestService
    // ----------------------------------------------------------------------------
    /**
     * Gets the genese-angular method name for the given http action verb
     */
    RequestMethodFactory.prototype.getGeneseMethod = function () {
        var _a;
        switch (this.action) {
            case request_method_enum_1.RequestMethod.DELETE:
                this.geneseMethod = genese_method_enum_1.GeneseMethod.DELETE;
                break;
            case request_method_enum_1.RequestMethod.GET:
                this.geneseMethod = ((_a = this.serverSide.schema) === null || _a === void 0 ? void 0 : _a.type) === 'array' ? genese_method_enum_1.GeneseMethod.GET_ALL : genese_method_enum_1.GeneseMethod.GET;
                break;
            case request_method_enum_1.RequestMethod.PATCH:
                this.geneseMethod = genese_method_enum_1.GeneseMethod.PATCH;
                break;
            case request_method_enum_1.RequestMethod.POST:
                this.geneseMethod = genese_method_enum_1.GeneseMethod.POST;
                break;
            case request_method_enum_1.RequestMethod.PUT:
                this.geneseMethod = genese_method_enum_1.GeneseMethod.PUT;
                break;
        }
        return this;
    };
    /**
     * Adds the method to the genese-request.service ClassFile
     */
    RequestMethodFactory.prototype.addMethodToGeneseRequestService = function () {
        var bodyMethod = '';
        switch (this.action) {
            case request_method_enum_1.RequestMethod.DELETE:
                bodyMethod = this.setDeclarationAndGetBodyOfDeleteRequestMethod();
                break;
            case request_method_enum_1.RequestMethod.GET:
                bodyMethod = this.setDeclarationAndGetBodyOfGetMethod();
                break;
            case request_method_enum_1.RequestMethod.PATCH:
            case request_method_enum_1.RequestMethod.POST:
            case request_method_enum_1.RequestMethod.PUT:
                bodyMethod = this.setDeclarationAndGetBodyOfPatchPostPutMethods();
                break;
        }
        this.method.addLine(bodyMethod);
        this.geneseRequestService.addMethod(this.method);
        return this;
    };
    /**
     * For a DELETE request, adds the corresponding method
     */
    RequestMethodFactory.prototype.setDeclarationAndGetBodyOfDeleteRequestMethod = function () {
        this.method.setDeclaration(this.method.name, this.method.params, "Observable<" + this.observable + ">");
        return "return this.geneseService.instance(" + this.tConstructorInstance + ")." + genese_method_enum_1.GeneseMethod.DELETE + "(`" + this.endPointWithParams + "`);";
    };
    /**
     * For a GET request, adds the corresponding method
     */
    RequestMethodFactory.prototype.setDeclarationAndGetBodyOfGetMethod = function () {
        if (this.geneseMethod === genese_method_enum_1.GeneseMethod.GET_ALL) {
            this.method.setDeclaration(this.method.name, this.method.params, "Observable<" + this.observable + "[]>");
            return "return this.geneseService.instance(" + this.serverSide.dataTypeName + ")." + this.geneseMethod + "(`" + this.endPointWithParams + "`, options);";
        }
        else {
            this.method.setDeclaration(this.method.name, this.method.params, "Observable<" + this.observable + ">");
            return "return this.geneseService.instance(" + this.tConstructorInstance + ")." + this.geneseMethod + "(`" + this.endPointWithParams + "`);";
        }
    };
    /**
     * For a PATCH, POST or PUT request, adds the corresponding method
     */
    RequestMethodFactory.prototype.setDeclarationAndGetBodyOfPatchPostPutMethods = function () {
        this.method.params = "body?: " + this.clientSide.dataTypeName + ", " + this.method.params;
        this.method.setDeclaration(this.method.name, this.method.params, "Observable<" + this.observable + ">");
        return "return this.geneseService.instance(" + this.tConstructorInstance + ")." + this.geneseMethod + "(`" + this.endPointWithParams + "`, body, options);";
    };
    /**
     * Updates the genese-request.service file with the constructed content
     */
    RequestMethodFactory.prototype.updateGeneseRequestService = function () {
        this.fileService.updateFile("/genese/genese-api/services/", "genese-request.service.ts", this.geneseRequestService.content);
    };
    Object.defineProperty(RequestMethodFactory.prototype, "endPointWithParams", {
        /**
         * Format endpoint path in order to add it in genese-angular call
         */
        get: function () {
            return new endpoint_model_1.Endpoint(this.endpoint).endpointWithParamsInPascalCase;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestMethodFactory.prototype, "tConstructorInstance", {
        /**
         * Gets the TConstructor used in genese-angular method call
         */
        get: function () {
            return this.serverSide.dataTypeName === 'any' ? '' : this.serverSide.dataTypeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestMethodFactory.prototype, "observable", {
        /**
         * Gets the type of the Observable of the genese-angular method
         */
        get: function () {
            return tools_service_1.isPrimitiveType(this.serverSide.dataTypeName) ? this.serverSide.dataTypeName.toLowerCase() : this.serverSide.dataTypeName;
        },
        enumerable: true,
        configurable: true
    });
    return RequestMethodFactory;
}());
exports.RequestMethodFactory = RequestMethodFactory;
