import { Server } from './server';
import { Parameters } from './parameters';

/**
 * OpenApi object
 * See https://swagger.io/specification/#linkObject
 */
export class Link {
	description?: string;
	operationId?: string;
	operationRef?: string;
	parameters?: Parameters;
	requestBody?: any;
	server?: Server;
}
