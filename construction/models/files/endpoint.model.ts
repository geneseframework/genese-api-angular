import { toCamelCase } from '../../services/tools.service';

export class Endpoint {

    public path = '';                               // The path of the endpoint
    public pathWithParamsInPascalCase = '';         // The path of the endpoint with params formatted in camelCase


    constructor(path: string) {
        this.path = path;
    }


    /**
     * Returns the path of the endpoint with params formatted in camelCase
     */
    get endpointWithParamsInPascalCase(): string {
        this.parseParams(this.path);
        return this.pathWithParamsInPascalCase;
    }


    /**
     * Parses recursively a path in order to format its params in camelCase
     * @param path
     */
    parseParams(path: string): void {
        const nextParam: EndpointParam = this.getNextParam(path);
        if (nextParam) {
            this.pathWithParamsInPascalCase = `${this.pathWithParamsInPascalCase}${path.slice(0, nextParam.leftIndex)}\${${nextParam.param}}`;
            const textAfterParam = path.slice(nextParam.rightIndex);
            this.parseParams(textAfterParam);
        } else {
            this.pathWithParamsInPascalCase = `${this.pathWithParamsInPascalCase}${path}`;
        }
    }


    /**
     * Returns the first param of a path
     * @param path
     */
    getNextParam(path: string): EndpointParam {
        const firstLeftBracketIndex = path?.indexOf('{');
        const firstRightBracketIndex = path?.indexOf('}');
        let endpointParam: EndpointParam = undefined;
        if (firstLeftBracketIndex > -1 && firstRightBracketIndex > firstLeftBracketIndex) {
            const param = toCamelCase(path.slice(firstLeftBracketIndex + 1, firstRightBracketIndex));
            endpointParam = {leftIndex: firstLeftBracketIndex, rightIndex: firstRightBracketIndex + 1, param};
        }
        return endpointParam;
    }
}


/**
 * Interface describing param properties in an endpoint
 */
interface EndpointParam {
    leftIndex?: number;
    param?: string;
    rightIndex?: number;
}
