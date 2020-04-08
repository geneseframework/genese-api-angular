import { Paths } from './paths';
import { ExternalDocs } from './external-docs';
import { Security } from './security';
import { Tag } from './tag';
import { Server } from './server';
import { Components } from './components';

/**
 * OpenApi object
 * See https://swagger.io/specification/#oasObject
 */
export class OpenApi {
	components?: Components;
	externalDocs?: ExternalDocs;
	info?: object;
	openapi?: string;
	paths?: Paths;
	security?: Security[];
	servers?: Server[];
	tags?: Tag[];
}
