export class Property {
	description ?= '';
	items?: Property = {};
	'$ref'?: string;
	type?: any;
}
