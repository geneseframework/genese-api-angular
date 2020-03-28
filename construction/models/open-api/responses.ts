import { Reference } from './reference';
import { Response } from './response';

export class Responses {
	// default?: Response | Reference;
	// [key: string]: Response;
	[responseCode: string]: Response | Reference;
}

export const RESPONSE_CODE = /[2345][0-9]{2}/;

