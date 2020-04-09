
/**
 * OpenApi object
 * See https://swagger.io/specification/#parameterObject
 */
export class Parameter {
	allowEmptyValue?: boolean;
	deprecated?: boolean;
	description?: string;
	in?: string;
	name?: string;
	required?: boolean;
}
