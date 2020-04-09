import { RequestBody } from './request-body';

/**
 * Array of OpenApi ExampleObject
 * See https://swagger.io/specification/#requestBodyObject
 */
export class RequestBodies {
	[key: string]: RequestBody;
}
