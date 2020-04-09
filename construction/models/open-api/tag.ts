import { ExternalDocs } from './external-docs';

/**
 * OpenApi object
 * See https://swagger.io/specification/#tagObject
 */
export class Tag {
	description?: string;
	externalDocs?: ExternalDocs;
	name?: string;
}
