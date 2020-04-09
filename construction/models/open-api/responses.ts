import { Reference } from './reference';
import { Response } from './response';

/**
 * OpenApi object
 * See https://swagger.io/specification/#responsesObject
 */
export class Responses {
	[responseCode: string]: Response | Reference;
}

export const RESPONSE_CODE = /[2345][0-9]{2}/;

