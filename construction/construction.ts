import { OpenApiFactory } from './factories/open-api.factory';
import { GeneseRequestServiceFactory } from './factories/genese-request-service.factory';
import { Config } from './services/config.service';

const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class Construction {


    private appRoot = appRootPath.toString();                           // Path to the root of the app
    public config = new Config();                                       // Config from .editorconfig file
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
            this.createEndpointsServicesAndDataTypes();
            this.createGeneseRequestService();
        });
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

