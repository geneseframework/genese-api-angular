import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RequestMethod } from '../models/requests/request-method.enum';
import {
    capitalize,
    getDataTypeNameFromRefSchema,
    isPrimitiveType,
    toCamelCase,
    toKebabCase,
    unCapitalize
} from '../services/tools.service';
import { GeneseMethod } from '../models/requests/genese-method.enum';
import { PathItem } from '../models/open-api/path-item';
import { OpenApiSchema } from '../models/open-api/open-api-schema';
import { RequestSideProperties } from '../models/requests/request-side-properties.interface';
import { RequestSide } from '../models/requests/request-side.enum';
import { Endpoint } from '../models/files/endpoint.model';
import { OpenApiService } from '../services/open-api.service';


/**
 * Factory of CRUD methods in order to add them into genese-request.service.ts file
 */
export class RequestMethodFactory {

    private action: RequestMethod = RequestMethod.GET;              // The action verb of the http request
    private clientSide: RequestSideProperties = {};                 // The properties of the client side of the request (body, ...)
    private endpoint = '';                                          // The endpoint path of the request
    private fileService: FileService = new FileService();           // The service managing files
    private geneseMethod: GeneseMethod;                             // The genese-angular method corresponding to the action
    private geneseRequestService = new ClassFile();                 // The content of genese-request.service.ts file (as ClassFile object)
    private method: Method = new Method();                          // The CRUD method to add
    private openApiService: OpenApiService;                         // Singleton service managing DataType files
    private pathItem: PathItem = new PathItem();                    // The PathItem containing the endpoint
    private serverSide: RequestSideProperties = {};                 // The properties of the server side of the request (response, ...)


    /**
     * Sets geneseRequestService with Singleton instance
     */
    constructor() {
        this.openApiService = OpenApiService.getInstance();
        this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
    }


    /**
     * Algorithm of the creation of CRUD method
     * @param action
     * @param endpoint
     * @param pathItem
     */
    addRequestMethod(action: RequestMethod, endpoint: string, pathItem: PathItem): void {
        this.init(action, endpoint, pathItem)
            .addNameAndParamsToMethod()
            .getContentsFromPathItem()
            .addProperties(RequestSide.CLIENT)
            .addProperties(RequestSide.SERVER)
            .getGeneseMethod()
            .addMethodToGeneseRequestService()
            .updateGeneseRequestService();
    }



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
    private init(action: RequestMethod, endpoint: string, pathItem: PathItem): RequestMethodFactory {
        this.action = action;
        this.endpoint = endpoint;
        this.pathItem = pathItem;
        return this;
    }


    /**
     * Adds the name and the parameters to the method
     */
    private addNameAndParamsToMethod(): RequestMethodFactory {
        let methodName = '';
        let params = '';
        let splittedEndpoint = this.endpoint.split('/');
        if (splittedEndpoint.length > 0) {
            for (let i = 1; i < splittedEndpoint.length; i++) {
                if (splittedEndpoint[i].charAt(0) === '{') {
                    const path = splittedEndpoint[i].slice(1, -1);
                    const param = toCamelCase(path);
                    methodName = `${methodName}By${capitalize(param)}`;
                    params = `${params}, ${param} = ''`;
                } else {
                    methodName = `${methodName}${capitalize(splittedEndpoint[i])}`;
                }
            }
        }
        this.method.name = `${this.action.toLowerCase()}${methodName}`;
        this.method.params = params ? `${unCapitalize(params.slice(2))}, options?: RequestOptions` : `options?: RequestOptions`;
        return this;
    }


    /**
     * Gets the OpenApi node 'content' for the client and the server side
     */
    private getContentsFromPathItem(): RequestMethodFactory {
        this.clientSide.content = this.pathItem?.[this.action.toLowerCase()]?.requestBody?.['content'];
        this.serverSide.content = this.pathItem?.[this.action.toLowerCase()]?.responses?.['200']?.['content'];
        return this;
    }



    // ----------------------------------------------------------------------------
    //		Add properties from client side and server side informations
    // ----------------------------------------------------------------------------


    /**
     * Adds properties to each request side (schema, refOrPrimitive, ...)
     * @param side
     */
    private addProperties(side: RequestSide): RequestMethodFactory {
        this.getSchemaFromContent(side)
            .addRefLinks(side)
            .getRefOrPrimitive(side)
            .getDataTypeNameFromRefSchema(side)
            .addImport(side);
        return this;
    }


    /**
     * Sets the schema for a given request side
     * @param side
     */
    private getSchemaFromContent(side: RequestSide): RequestMethodFactory {
        let schema: any = this[side]?.content?.['application/json']?.schema ?? this[side]?.['text/plain']?.schema as OpenApiSchema;
        this[side].schema = schema ?? {type: 'any'};
        return this;
    }



    addRefLinks(side: RequestSide): RequestMethodFactory {
        if (this[side].schema) {
            if (this[side].schema?.$ref) {
                this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema.$ref));
            } else if (this[side].schema?.type === 'array' && this[side].schema?.items?.$ref) {
                this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema?.items?.$ref));
            }
        }
        return this;
    }


    /**
     *     - Sets reference or primitive for a given request side
     *     - Adds dataTypeName to the set of DataType names
     * @param side  /  client or server side
     */
    private getRefOrPrimitive(side: RequestSide): RequestMethodFactory {
        if (this[side].schema) {
            if (this[side].schema?.$ref) {
                // this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema.$ref));
                this[side].refOrPrimitive = this[side].schema?.$ref;
            } else {
                switch (this[side].schema?.type) {
                    case 'array':
                        this[side].refOrPrimitive = this[side].schema?.items?.$ref;
                        // if (this[side].schema?.items?.$ref) {
                        //     this.openApiService.addRefLinks(getDataTypeNameFromRefSchema(this[side].schema.$ref));
                        // }
                        break;
                    case 'string':
                    case 'number':
                    case 'boolean':
                    case 'any':
                        this[side].refOrPrimitive = this[side].schema?.type;
                        break;
                    default:
                        throw Error('Incorrect schema type');
                }
            }
        }
        return this;
    }


    /**
     * If necessary, adds import for a given request side
     * @param side
     */
    private addImport(side: RequestSide): RequestMethodFactory {
        if (this[side].dataTypeName && !isPrimitiveType(this[side].dataTypeName) && this[side].refOrPrimitive !== 'any') {
            this.geneseRequestService.addImport(this[side].dataTypeName, `../datatypes/${toKebabCase(this[side].dataTypeName)}.datatype`);
        }
        return this;
    }


    /**
     * Gets the name of the DataType included in a reference of a schema
     * @param side
     */
    private getDataTypeNameFromRefSchema(side: RequestSide): RequestMethodFactory {
        this[side].dataTypeName = getDataTypeNameFromRefSchema(this[side].refOrPrimitive);
        return this;
    }



    // ----------------------------------------------------------------------------
    //					   Add method to GeneseRequestService
    // ----------------------------------------------------------------------------


    /**
     * Gets the genese-angular method name for the given http action verb
     */
    private getGeneseMethod(): RequestMethodFactory {
        switch (this.action) {
            case RequestMethod.DELETE:
                this.geneseMethod = GeneseMethod.DELETE;
                break;
            case RequestMethod.GET:
                this.geneseMethod = this.serverSide.schema?.type === 'array' ? GeneseMethod.GET_ALL : GeneseMethod.GET;
                break;
            case RequestMethod.PATCH:
                this.geneseMethod = GeneseMethod.PATCH;
                break;
            case RequestMethod.POST:
                this.geneseMethod = GeneseMethod.POST;
                break;
            case RequestMethod.PUT:
                this.geneseMethod = GeneseMethod.PUT;
                break;
        }
        return this;
    }


    /**
     * Adds the method to the genese-request.service ClassFile
     */
    private addMethodToGeneseRequestService(): RequestMethodFactory {
        let bodyMethod = '';
        switch (this.action) {
            case RequestMethod.DELETE:
                bodyMethod = this.setDeclarationAndGetBodyOfDeleteRequestMethod();
                break;
            case RequestMethod.GET:
                bodyMethod = this.setDeclarationAndGetBodyOfGetMethod();
                break;
            case RequestMethod.PATCH:
            case RequestMethod.POST:
            case RequestMethod.PUT:
                bodyMethod = this.setDeclarationAndGetBodyOfPatchPostPutMethods();
                break;
        }
        this.method.addLine(bodyMethod);
        this.geneseRequestService.addMethod(this.method);
        return this;
    }


    /**
     * For a DELETE request, adds the corresponding method
     */
    private setDeclarationAndGetBodyOfDeleteRequestMethod(): string {
        this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.observable}>`);
        return `return this.geneseService.instance(${this.tConstructorInstance}).${GeneseMethod.DELETE}(\`${this.endPointWithParams}\`);`;
    }


    /**
     * For a GET request, adds the corresponding method
     */
    private setDeclarationAndGetBodyOfGetMethod(): string {
        if (this.geneseMethod === GeneseMethod.GET_ALL) {
            this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.observable}[]>`);
            return `return this.geneseService.instance(${this.serverSide.dataTypeName}).${this.geneseMethod}(\`${this.endPointWithParams}\`, options);`;
        } else {
            this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.observable}>`);
            return `return this.geneseService.instance(${this.tConstructorInstance}).${this.geneseMethod}(\`${this.endPointWithParams}\`);`;
        }
    }


    /**
     * For a PATCH, POST or PUT request, adds the corresponding method
     */
    private setDeclarationAndGetBodyOfPatchPostPutMethods(): string {
        this.method.params = `body?: ${this.clientSide.dataTypeName}, ${this.method.params}`;
        this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.observable}>`);
        return `return this.geneseService.instance(${this.tConstructorInstance}).${this.geneseMethod}(\`${this.endPointWithParams}\`, body, options);`;
    }


    /**
     * Updates the genese-request.service file with the constructed content
     */
    private updateGeneseRequestService() {
        this.fileService.updateFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
    }


    /**
     * Format endpoint path in order to add it in genese-angular call
     */
    private get endPointWithParams(): string {
        return new Endpoint(this.endpoint).endpointWithParamsInPascalCase;
    }


    /**
     * Gets the TConstructor used in genese-angular method call
     */
    private get tConstructorInstance(): string {
        return this.serverSide.dataTypeName === 'any' ? '' : this.serverSide.dataTypeName;
    }


    /**
     * Gets the type of the Observable of the genese-angular method
     */
    private get observable(): string {
        return isPrimitiveType(this.serverSide.dataTypeName) ? this.serverSide.dataTypeName.toLowerCase() : this.serverSide.dataTypeName;
    }
}
