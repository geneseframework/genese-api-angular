import { Content } from '../open-api/content';
import { OpenApiSchema } from '../open-api/open-api-schema';

/**
 * Properties of each 'side' of http requests (body, response)
 */
export interface RequestSideProperties {
    content?: Content,
    dataTypeName?: string,
    schema?: OpenApiSchema,
    refOrPrimitive?: string
}
