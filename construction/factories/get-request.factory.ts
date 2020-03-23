import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { Tools } from '../services/tools';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RestAction } from '../models/rest-action.type';


export class GetRequestFactory {

	private geneseRequestService = new ClassFile();
	// private className = '';
	private classNameService = '';
	// private content = '';
	private fileService: FileService = new FileService();
	private method?: Method = new Method();
	private observableType = '';
	private route = '';


	constructor() {
		this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
	}



	public createRequestMethod(action: RestAction, endpoint: string, content: Content) {
		let observableType = '';
		let importFrom = '';
		const method = this.fileService.getMethodWithActionAndEndpoint(action, endpoint);
		if (content['application/json']) {
			const schema: any = content['application/json'].schema;
			if (schema?.$ref) {
				observableType = this.fileService.getDataTypeNameFromRefSchema(schema?.$ref);
				importFrom = `${this.fileService.getFileNameWithClassName(observableType)}.datatype`;
				console.log('GET REQUEST FACTORY importFrom', importFrom);
				this.addGetOneMethod(method, observableType, endpoint);
				this.geneseRequestService.addImport(observableType, `../datatypes/${importFrom}`);
			} else if (schema?.type) {
				// TODO
			}
		} else {
			// TODO
		}
		console.log('GET REQUEST FACTORY observableType', observableType);
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
