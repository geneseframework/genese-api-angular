import { PathItem } from './path-item';

/**
 * OpenApi object
 * See https://swagger.io/specification/#pathsObject
 */
export class Paths {
	[path: string]: PathItem;
}
