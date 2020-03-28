import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RestAction } from '../models/rest-action.type';
import { getDataTypeNameFromRefSchema, getRequestMethod, toKebabCase, toPascalCase } from '../services/tools.service';
import { GeneseMethod } from '../models/genese-method.enum';
import { PathItem } from '../models/open-api/path-item';
import { OpenApiSchema } from '../models/open-api/open-api-schema';


export class RequestMethodFactory {

	private action: RestAction = 'GET';
	private content: Content = new Content();
	private geneseRequestService = new ClassFile();
	private fileService: FileService = new FileService();
	private method: Method = new Method();
	private pathItem: PathItem = new PathItem();
	private route: string = '';
	private schema: OpenApiSchema = new OpenApiSchema();


	constructor() {
		this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
	}



	init(action: RestAction, route: string, pathItem: PathItem): RequestMethodFactory {
		this.action = action;
		this.route = route;
		this.pathItem = pathItem;
		return this;
	}



	addGetRequest(route: string, pathItem: PathItem): void {
		this.init('GET', route, pathItem)
			.getContent()
			.createGetMethod('GET', route, pathItem?.get?.responses?.['200']?.['content']);
	}



	addPostRequest(route: string, pathItem: PathItem): void {
		const getRequestFactory: RequestMethodFactory = new RequestMethodFactory();
		getRequestFactory.createPostMethod('POST', route, pathItem?.post?.requestBody?.['content']);
	}



	getContent(): RequestMethodFactory {
		switch (this.action) {
			case 'GET':
				this.content = this.pathItem?.get?.responses?.['200']?.['content'];
				break;
			case 'POST':
				this.content = this.pathItem?.post?.requestBody?.['content'];
				break;
			default: {
				throw 'Incorrect http action verb';
			}
		}
		return this;
	}



	getSchema(): RequestMethodFactory {
		const schema: any = this.content['application/json']?.schema ?? this.content['text/plain'].schema as OpenApiSchema;
		this.schema = schema;
		return this;
	}

	createGetMethod(action: RestAction, endpoint: string, content: Content) {
		const method = getRequestMethod(action, endpoint);
		if (content['application/json']?.schema || content['text/plain']?.schema) {
			const schema: any = content['application/json']?.schema ?? content['text/plain'].schema;
			if (schema?.$ref) {
				this.createGetMethodWithRef(method, schema?.$ref, endpoint, GeneseMethod.GET_ONE_CUSTOM);
			} else if (schema?.type) {
				if (schema.type === 'array') {
					if (schema.items.$ref) {
						this.createGetMethodWithRef(method, schema.items.$ref, endpoint, GeneseMethod.GET_ALL_CUSTOM);
					}
				}
			}
		} else {
			// TODO
		}
		this.fileService.createFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}



	createGetMethodWithRef(method: Method, ref: string, endpoint: string, geneseMethod: GeneseMethod): void {
		let dataTypeName = getDataTypeNameFromRefSchema(ref);
		const observableType =  (/All/.test(geneseMethod)) ? `${dataTypeName}[]` : `${dataTypeName}`;
		const importFrom = `${toKebabCase(dataTypeName)}.datatype`;
		this.geneseRequestService.addImport(dataTypeName, `../datatypes/${importFrom}`);
		method.setDeclaration(method.name, method.params, `Observable<${observableType}>`);
		const endpointWithParams = toPascalCase(endpoint.replace('{', '${'));
		const returnLine = `return this.geneseService.getGeneseInstance(${dataTypeName}).${geneseMethod}(\`${endpointWithParams}\`);`;
		method.addLine(returnLine);
		this.geneseRequestService.addMethod(method);
	}



	// ----------------------------------------------------------------------------
	//						  Files and classes formatting
	// ----------------------------------------------------------------------------



	createPostMethod(action: RestAction, endpoint: string, content: Content): void {
		const method: Method = getRequestMethod(action, endpoint);
		if (content['application/json']?.schema || content['text/plain']?.schema) {
			const schema: any = content['application/json']?.schema ?? content['text/plain'].schema;
			if (schema?.$ref) {
				this.createPostMethodWithRef(method, schema?.$ref, endpoint, GeneseMethod.CREATE_CUSTOM);
			} else if (schema?.type) {
				if (schema.type === 'array') {
					if (schema.items.$ref) {
						this.createPostMethodWithRef(method, schema.items.$ref, endpoint, GeneseMethod.CREATE_CUSTOM);
					}
				}
			}
		} else {
			// TODO
		}
		this.fileService.createFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}



	createPostMethodWithRef(method: Method, ref: string, endpoint: string, geneseMethod: GeneseMethod): void {
		let dataTypeName = getDataTypeNameFromRefSchema(ref);
		method.params = 'body?: any';
		const importFrom = `${toKebabCase(dataTypeName)}.datatype`;
		this.geneseRequestService.addImport(dataTypeName, `../datatypes/${importFrom}`);
		method.setDeclaration(method.name, method.params, `Observable<any>`);
		const endpointWithParams = toPascalCase(endpoint.replace('{', '${'));
		const returnLine = `return this.geneseService.getGeneseInstance(${dataTypeName}).${geneseMethod}(\`${endpointWithParams}\`);`;
		method.addLine(returnLine);
		this.geneseRequestService.addMethod(method);
	}
}
