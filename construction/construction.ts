import { OpenApiFactory } from './factories/open-api.factory';
import { GeneseRequestServiceFactory } from './factories/genese-request-service.factory';
import { Config } from './services/config.service';

const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class Construction {


	private appRoot = appRootPath.toString();
	public config = new Config();
    private geneseRequestServiceFactory: GeneseRequestServiceFactory;
	private openApiFactory = new OpenApiFactory();


	constructor() {
	}



	startConstruction(): void {
	    this.getConfig().then(() => {
	        this.geneseRequestServiceFactory = GeneseRequestServiceFactory.getInstance();
            this.createFolders();
            this.createGeneseRequestService();
            this.createEndpointsServicesAndDataTypes();
        });
	}



    getConfig(): Promise<any> {
        return this.config.setConfig();
    }



	createFolders(): void {
		fse.removeSync(this.appRoot + '/genese');
		fse.mkdirsSync(this.appRoot + '/genese/genese-api/datatypes');
		fse.mkdirsSync(this.appRoot + '/genese/genese-api/services');
	}



	createGeneseRequestService(): void {
		this.geneseRequestServiceFactory.init();
	}



	createEndpointsServicesAndDataTypes(): void {
		this.openApiFactory.init();
	}

}

