import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { DatatypeFactory } from './datatype.factory';
import { OpenApiSchema } from '../models/open-api/open-api-schema';


/**
 * Factory for OpenApi Schemas objects
 * See https://swagger.io/specification/#schemaObject
 */
export class SchemasFactory implements InitFactoriesInterface {

    private openApiService: OpenApiService = OpenApiService.getInstance();      // Instance of OpenApiService


    constructor() {
    }


    /**
     * Starts the creation of the DataTypes for each Schema
     */
    init(target: any): void {
        if (target?.schemas) {
            this.openApiService.openApi.components.schemas = {};
            this.createDataTypes(target.schemas);
        }
    }


    /**
     * Create DataType file for each Schema
     * @param schemas
     */
    createDataTypes(schemas: OpenApiSchema[]): void {
        for (const dataTypeName of Object.keys(schemas)) {
            const dataTypeFactory = new DatatypeFactory();
            dataTypeFactory.create(dataTypeName, schemas[dataTypeName]);
            this.openApiService.openApi.components.schemas[dataTypeName] = schemas[dataTypeName];
        }
    }



}
