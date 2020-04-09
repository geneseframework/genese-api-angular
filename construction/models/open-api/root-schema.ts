
/**
 * OpenApi object
 * See https://swagger.io/specification/#schemaObject
 */
export class RootSchema {
	items?: RootSchema = {};
	$ref ?= '';
	title ?= '';
	type ?= '';
}
