import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { ComponentsFactory } from './components.factory';
import { PathsFactory } from './paths.factory';

/**
 * Factory of DataTypes and Endpoints with the genese-api.json file
 * Format of OpenApi objects : see https://swagger.io/specification/#oasObject
 */
export class OpenApiFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();      // Instance of OpenApiService


	constructor() {}


    /**
     * Starts the creation of the DataTypes and of the request services of genese-request.service.ts file
     */
	init() {
		this.openApiService.openApi = {openapi: this.openApiService.openApiJsonFile.openapi};
		this.createDataTypes();
		this.createEndpointsServices();
	}


    /**
     * Creates the DataTypes
     */
	createDataTypes(): void {
		this.openApiService.next(this.openApiService.openApiJsonFile, ComponentsFactory);
	}


    /**
     * Creates the request services of genese-request.service.ts file
     */
	createEndpointsServices(): void {
		this.openApiService.next(this.openApiService.openApiJsonFile, PathsFactory);
	}
}
