
/**
 * OpenApi object
 * See https://swagger.io/specification/#schemaObject
 */
export class OpenApiSchema {
	$ref?: string;
	additionalProperties?: boolean | OpenApiSchema;
	allOf?: OpenApiSchema[];
	anyOf?: OpenApiSchema[];
	default?: any;
	description?: string;
	enum?: any[];
	example?: any;
	exclusiveMaximum?: number;
	exclusiveMinimum?: number;
	format?: string;
	items?: OpenApiSchema;
	maximum?: number;
	maxItems?: number;
	maxLength?: number;
	maxProperties?: number;
	minimum?: number;
	minItems?: number;
	minLength?: number;
	minProperties?: number;
	multipleOf?: number;
	not?: OpenApiSchema;
	oneOf?: OpenApiSchema[];
	pattern?: string;
	properties?: { [key: string]: OpenApiSchema};
	required?: string[];
	title?: string;
	type?: string;
	uniqueItems?: boolean;
}
