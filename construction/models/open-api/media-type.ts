import { Reference } from './reference';
import { OpenApiSchema } from './open-api-schema';

export class MediaType {
	encoding?: any[];
	example?: any;
	examples?: any[];
	schema?: OpenApiSchema | Reference;
}
