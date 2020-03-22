import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { ComponentsFactory } from './components.factory';
import { PathsFactory } from './paths.factory';


export class OpenApiFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();


	constructor() {}



	init() {
		this.openApiService.openApi = {openapi: this.openApiService.getOpenApiJsonFile().openapi};
		this.createDataTypes();
		this.createEndpointsServices();
	}



	createDataTypes(): void {
		this.openApiService.next(this.openApiService.getOpenApiJsonFile(), ComponentsFactory);
	}



	createEndpointsServices(): void {
		this.openApiService.next(this.openApiService.getOpenApiJsonFile(), PathsFactory);
	}
}
