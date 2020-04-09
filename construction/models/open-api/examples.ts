import { Example } from './example';

/**
 * Array of OpenApi ExampleObject
 * See https://swagger.io/specification/#exampleObject
 */
export class Examples {
	[key: string] : Example;
}
