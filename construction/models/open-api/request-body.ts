import { Content } from './content';

/**
 * OpenApi object
 * See https://swagger.io/specification/#requestBodyObject
 */
export class RequestBody {
	content?: Content;
	description?: string;
	required?: boolean;
}
