import { PathItem } from './path-item';

/**
 * OpenApi object
 * See https://swagger.io/specification/#callbackObject
 */
export class Callback {
	[expression: string]: PathItem;
}
