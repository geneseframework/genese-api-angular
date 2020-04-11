import { OpenApiFactory } from './factories/open-api.factory';
import { GeneseRequestServiceFactory } from './factories/genese-request-service.factory';
import { Config } from './services/config.service';
import { HandlebarsFactory } from './factories/handlebars.factory';

const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class Construction {


    config = new Config();                                              // Config from .editorconfig file
    handlebarsFactory = new HandlebarsFactory();

    private appRoot = appRootPath.toString();                           // Path to the root of the app
    private geneseRequestServiceFactory: GeneseRequestServiceFactory;   // Factory for genese-request.service.ts generation
    private openApiFactory = new OpenApiFactory();                      // Factory for the datatypes files



    constructor() {
    }



    /**
     * Starts the code generation
     */
    startConstruction(): void {
        this.getConfig().then(() => {
            this.geneseRequestServiceFactory = GeneseRequestServiceFactory.getInstance();
            this.createFolders();
            this.createHandlebars();
            // this.createGeneseRequestService();
            // this.createEndpointsServicesAndDataTypes();
        });
    }



    createHandlebars(): void {
        this.handlebarsFactory.createHandlebars();
    }



    /**
     * Get editor config from .editorconfig file
     */
    getConfig(): Promise<any> {
        return this.config.setConfig();
    }



    /**
     * Creates the genese-api folders
     */
    createFolders(): void {
        fse.removeSync(this.appRoot + '/genese');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/datatypes');
        fse.mkdirsSync(this.appRoot + '/genese/genese-api/services');
    }



    /**
     * Creates the genese-request.service.ts file
     */
    createGeneseRequestService(): void {
        this.geneseRequestServiceFactory.init();
    }



    /**
     * Parses the genese-api.json file in order to :
     *     - parse the datatypes of the json file in order to create the datatype.ts files
     *     - parse the endpoint paths in order to add methods to genese-request.service.ts file
     */
    createEndpointsServicesAndDataTypes(): void {
        this.openApiFactory.init();
    }

}

