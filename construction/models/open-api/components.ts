import { Schemas } from './schemas';
import { Responses } from './responses';
import { Parameters } from './parameters';
import { Examples } from './examples';
import { RequestBody } from './request-body';
import { Header } from './header';
import { Links } from './links';
import { Callbacks } from './callbacks';

/**
 * OpenApi object
 * See https://swagger.io/specification/#componentsObject
 */
export class Components {
	callbacks?: Callbacks;
	examples?: Examples = new Examples();
	headers ?= {gnMap: new Header()};
	links?: Links;
	parameters?: Parameters = new Parameters();
	requestBodies ?= {gnMap: new RequestBody()};
	responses?: Responses = new Responses();
	schemas?: Schemas = new Schemas();
	securitySchemes?: any;
}
