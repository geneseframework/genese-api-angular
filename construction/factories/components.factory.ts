import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { SchemasFactory } from './schemas.factory';

/**
 * Factory for OpenApi Components objects (DataTypes in Apicurio)
 * See https://swagger.io/specification/#componentsObject
 */
export class ComponentsFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();      // Instance of OpenApiService


	constructor() {
	}


    /**
     * Starts the creation of the DataTypes : node Component => node Schemas
     */
	init(target: any): void {
		if (target?.components) {
			this.openApiService.openApi.components = {};
			this.openApiService.next(target.components, SchemasFactory);
		}
	}
}
