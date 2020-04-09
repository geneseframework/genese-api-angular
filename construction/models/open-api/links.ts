import { Link } from './link';
import { Reference } from './reference';


/**
 * Array of OpenApi ExampleObject
 * See https://swagger.io/specification/#linkObject
 */
export class Links {
	[key: string]: Link | Reference;
}
