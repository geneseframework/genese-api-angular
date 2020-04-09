import { RequestBody } from './request-body';
import { Parameter } from './parameter';
import { Responses } from './responses';
import { Server } from './server';
import { ExternalDocs } from './external-docs';
import { Security } from './security';
import { Callbacks } from './callbacks';
import { Reference } from './reference';

/**
 * OpenApi object
 * See https://swagger.io/specification/#operationObject
 */
export class Operation {
	callbacks?: Callbacks;
	deprecated?: boolean;
	description?: string;
	externalDocs?: ExternalDocs;
	operationId?: string;
	parameters?: [Parameter | Reference];
	requestBody?: RequestBody | Reference;
	responses?: Responses;
	security?: Security[];
	servers?: Server[];
	summary?: string;
	tags?: string[];
}
