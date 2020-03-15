import { Server } from './server';
import { Parameters } from './parameters';

export class Link {
	description?: string;
	operationId?: string;
	operationRef?: string;
	parameters?: Parameters;
	requestBody?: any;
	server?: Server;
}
