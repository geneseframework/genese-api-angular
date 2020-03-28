import { MediaType } from './media-type';

export class Content {
	[contentType: string]: MediaType;
}

export enum CONTENT_TYPE {
	ALL = '*/*',
	JSON = 'application/json',
	MEDIA = 'multipart/form-data',
	TEXT_PLAIN = 'text/plain',
	TEXT_HTML = 'text/html',
	XML = 'application/xml',
}
