import { toCamelCase } from '../../services/tools.service';

export class Endpoint {

    public path = '';                           // The path of the endpoint
    public pathWithParamsInPascalCase = '';     // The path of the endpoint with params formatted in camelCase

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
    parseParams(path) {
        var nextParam = this.getNextParam(path);
        if (nextParam) {
            this.pathWithParamsInPascalCase = "" + this.pathWithParamsInPascalCase + path.slice(0, nextParam.leftIndex) + "${" + nextParam.param + "}";
            var textAfterParam = path.slice(nextParam.rightIndex);
            this.parseParams(textAfterParam);
        } else {
            this.pathWithParamsInPascalCase = "" + this.pathWithParamsInPascalCase + path;
        }
    };


    /**
     * Returns the first param of a path
     * @param path
     */
    getNextParam(path) {
        var firstLeftBracketIndex = path === null || path === void 0 ? void 0 : path.indexOf('{');
        var firstRightBracketIndex = path === null || path === void 0 ? void 0 : path.indexOf('}');
        var endpointParam = undefined;
        if (firstLeftBracketIndex > -1 && firstRightBracketIndex > firstLeftBracketIndex) {
            var param = toCamelCase(path.slice(firstLeftBracketIndex + 1, firstRightBracketIndex));
            endpointParam = {leftIndex: firstLeftBracketIndex, rightIndex: firstRightBracketIndex + 1, param: param};
        }
        return endpointParam;
    }
}
