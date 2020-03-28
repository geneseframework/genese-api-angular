import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { DatatypeFactory } from './datatype.factory';
import { OpenApiSchema } from '../models/open-api/open-api-schema';


export class SchemasFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();


	constructor() {
	}



	init(target: any): void {
		if (target?.schemas) {
			this.openApiService.openApi.components.schemas = {};
			this.createDataTypes(target.schemas);
		}
	}



	createDataTypes(schemas: OpenApiSchema[]): void {
		for (const dataTypeName of Object.keys(schemas)) {
			const dataTypeFactory = new DatatypeFactory();
			dataTypeFactory.create(dataTypeName, schemas[dataTypeName]);
			this.openApiService.openApi.components.schemas[dataTypeName] = schemas[dataTypeName];
		}
	}



}
