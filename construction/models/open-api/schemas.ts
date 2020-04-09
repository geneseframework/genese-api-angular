import { Reference } from './reference';
import { OpenApiSchema } from './open-api-schema';

/**
 * OpenApi object (property of ComponentsObject)
 * See https://swagger.io/specification/#schemaObject
 */
export class Schemas {
	[key: string]: OpenApiSchema | Reference;
}
