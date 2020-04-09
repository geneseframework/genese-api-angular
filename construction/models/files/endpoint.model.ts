import { toCamelCase } from '../../services/tools.service';

export class Endpoint {

    public path = '';
    public pathWithParamsInPascalCase = '';


    constructor(path: string) {
        this.path = path;
    }


    get endpointWithParamsInPascalCase(): string {
        this.getParams(this.path);
        return this.pathWithParamsInPascalCase;
    }


    getParams(text: string): void {
        const nextParam: EndpointParam = this.getNextParam(text);
        if (nextParam) {
            this.pathWithParamsInPascalCase = `${this.pathWithParamsInPascalCase}${text.slice(0, nextParam.leftIndex)}\${${nextParam.param}}`;
            const textAfterParam = text.slice(nextParam.rightIndex);
            this.getParams(textAfterParam);
        } else {
            this.pathWithParamsInPascalCase = `${this.pathWithParamsInPascalCase}${text}`;
        }
    }


    getNextParam(text: string): EndpointParam {
        const firstLeftBracketIndex = text?.indexOf('{');
        const firstRightBracketIndex = text?.indexOf('}');
        let endpointParam: EndpointParam = undefined;
        if (firstLeftBracketIndex > -1 && firstRightBracketIndex > firstLeftBracketIndex) {
            const param = toCamelCase(text.slice(firstLeftBracketIndex + 1, firstRightBracketIndex));
            endpointParam = {leftIndex: firstLeftBracketIndex, rightIndex: firstRightBracketIndex + 1, param};
        }
        return endpointParam;
    }
}


interface EndpointParam {
    leftIndex?: number;
    param?: string;
    rightIndex?: number;
}
