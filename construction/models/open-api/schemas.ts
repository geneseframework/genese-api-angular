import { Reference } from './reference';
import { OpenApiSchema } from './open-api-schema';

export class Schemas {
	[key: string]: OpenApiSchema | Reference;
}
