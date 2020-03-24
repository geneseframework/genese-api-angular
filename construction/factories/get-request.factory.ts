import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RestAction } from '../models/rest-action.type';
import { getDataTypeNameFromRefSchema, getRequestMethod, toKebabCase } from '../services/tools.service';


export class GetRequestFactory {

	private geneseRequestService = new ClassFile();
	private fileService: FileService = new FileService();


	constructor() {
		this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
	}



	public createRequestMethod(action: RestAction, endpoint: string, content: Content) {
		let observableType = '';
		let importFrom = '';
		const method = getRequestMethod(action, endpoint);
		if (content['application/json']) {
			const schema: any = content['application/json'].schema;
			if (schema?.$ref) {
				observableType = getDataTypeNameFromRefSchema(schema?.$ref);
				importFrom = `${toKebabCase(observableType)}.datatype`;
				this.addGetOneMethod(method, observableType, endpoint);
				this.geneseRequestService.addImport(observableType, `../datatypes/${importFrom}`);
			} else if (schema?.type) {
				// TODO
			}
		} else {
			// TODO
		}
		this.fileService.createFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}



	addGetOneMethod(method: Method, observableType: string, endpoint: string): void {
		method.setDeclaration(method.name, method.params, `Observable<${observableType}>`);
		const endpointWithParams = endpoint.replace('{', '${');
		const returnLine = `return this.geneseService.getGeneseInstance(${observableType}).getOneCustom(\`${endpointWithParams}\`);`;
		method.addLine(returnLine);
		this.geneseRequestService.addMethod(method);
	}
}
