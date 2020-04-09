import { Reference } from './reference';
import { OpenApiSchema } from './open-api-schema';

/**
 * OpenApi object
 * See https://swagger.io/specification/#mediaTypeObject
 */
export class MediaType {
	encoding?: any[];
	example?: any;
	examples?: any[];
	schema?: OpenApiSchema | Reference;
}
