import { Content } from './content';
import { Header } from './header';
import { Links } from './links';

/**
 * OpenApi object
 * See https://swagger.io/specification/#responseObject
 */
export class Response {
	content?: Content;
	description?: string;
	headers?: Header;
	links?: Links;
}
