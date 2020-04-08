import { TConstructor } from '../models/tconstructor';
import { OpenApi } from '../models/open-api/open-api';

const appRootPath = require('app-root-path');

/**
 * Services for the genese-api.json file and for parsing the OpenApi structure
 */
export class OpenApiService {

    private appRoot = appRootPath.toString();               // Root of the app
    private static instance?: OpenApiService;               // Singleton instance of OpenApiService
    public openApi?: OpenApi = {};                          // Empty OpenApi structure which will contain all the elements coming from the genese-api.json file
    private readonly _openApiJsonFile?: OpenApi = {};       // The content of the genese-api.json file

    private constructor() {
        this._openApiJsonFile = require(this.appRoot + '/genese-api.json');
    }


    /**
     * Singleton instance of this service
     */
    static getInstance() {
        if (!OpenApiService.instance) {
            OpenApiService.instance = new OpenApiService();
        }
        return OpenApiService.instance;
    }


    /**
     * get the content of genese-api.json file as OpenApi object
     */
    get openApiJsonFile(): OpenApi {
        return this._openApiJsonFile;
    }


    /**
     * Method used for parsing the OpenApi structure
     * Ex : OpenApiFactory => ComponentsFactory => SchemasFactory => ...
     *
     * @param target {object}                   // content to send to the next step (a Component, a Schema, ...)
     * @param propertyClass {TConstructor<T>}   // class of the next step (ComponentsFactory, SchemasFactory,...)
     * @param options                           // other information to send to the next step
     */
    next<T>(target: object, propertyClass: TConstructor<T>, options?: any): OpenApiService {
        if (target && propertyClass) {
            const nextPropertyClassObject = new propertyClass();
            if (options) {
                nextPropertyClassObject['init'](target, options);
            } else {
                nextPropertyClassObject['init'](target);
            }
        }
        return this;
    }
}
