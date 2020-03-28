import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RestAction } from '../models/rest-action.type';
import {
	capitalize,
	getDataTypeNameFromRefSchema,
	isPrimitiveType,
	toKebabCase,
	toPascalCase,
	unCapitalize
} from '../services/tools.service';
import { GeneseMethod } from '../models/genese-method.enum';
import { PathItem } from '../models/open-api/path-item';
import { OpenApiSchema } from '../models/open-api/open-api-schema';


export class RequestMethodFactory {

	private action: RestAction = 'GET';
	private content: Content = new Content();
	private dataTypeName = '';
	private endpoint = '';
	private fileService: FileService = new FileService();
	private geneseMethod: GeneseMethod;
	private geneseRequestService = new ClassFile();
	private method: Method = new Method();
	private pathItem: PathItem = new PathItem();
	private refOrPrimitive = '';
	private schema: OpenApiSchema = new OpenApiSchema();


	constructor() {
		this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
	}



	init(action: RestAction, endpoint: string, pathItem: PathItem): RequestMethodFactory {
		this.action = action;
		this.endpoint = endpoint;
		this.pathItem = pathItem;
		return this;
	}



	addGetRequest(endpoint: string, pathItem: PathItem): void {
		this.init('GET', endpoint, pathItem)
			.getContent()
			.getSchema()
			.addNameAndParamsToMethod()
			.getGeneseMethod()
			.getRefOrPrimitive()
			.getDataTypeNameFromRefSchema()
			.addImport()
			.addMethodToGeneseRequestService()
			.updateGeneseRequestService();
	}



	addPostRequest(endpoint: string, pathItem: PathItem): void {
		this.init('POST', endpoint, pathItem)
			.getContent()
			.getSchema()
			.addNameAndParamsToMethod()
			.getGeneseMethod()
			.getRefOrPrimitive()
			.getDataTypeNameFromRefSchema()
			.addImport()
			.addMethodToGeneseRequestService()
			.updateGeneseRequestService();
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
		const schema: any = this.content['application/json']?.schema ?? this.content['text/plain']?.schema as OpenApiSchema;
		this.schema = schema ?? {type: 'any'};
		return this;
	}



	getGeneseMethod(): RequestMethodFactory {
		switch (this.action) {
			case 'GET':
				this.geneseMethod = this.schema?.type === 'array' ? GeneseMethod.GET_ALL_CUSTOM : GeneseMethod.GET_ONE_CUSTOM;
				break;
			case 'POST':
				this.geneseMethod = GeneseMethod.CREATE_CUSTOM;
		}
		return this;
	}



	getRefOrPrimitive(): RequestMethodFactory {
		if (this.schema?.$ref) {
			this.refOrPrimitive = this.schema?.$ref;
		} else {
			switch (this.schema?.type) {
				case 'array':
					this.refOrPrimitive = this.schema?.items?.$ref;
					break;
				case 'string':
				case 'any':
				case 'number':
				case 'boolean':
					this.refOrPrimitive = this.schema?.type;
					break;
				default:
					throw 'Unknown schema type';
			}
		}
		return this;
	}



	addImport(): RequestMethodFactory {
		if (!isPrimitiveType(this.dataTypeName) && this.refOrPrimitive !== 'any') {
			console.log('this.refOrPrimitive', this.refOrPrimitive);
			this.geneseRequestService.addImport(this.dataTypeName, `../datatypes/${toKebabCase(this.dataTypeName)}.datatype`);
		}
		return this;
	}



	addMethodToGeneseRequestService(): RequestMethodFactory {
		switch (this.action) {
			case 'GET':
				this.addGetMethodToGeneseRequestService();
				break;
			case 'POST':
				this.addPostMethodToGeneseRequestService();
				break;
		}
		return this;
	}



	addGetMethodToGeneseRequestService(): void {
		const observableType =  (/All/.test(this.geneseMethod)) ? `${this.dataTypeName}[]` : `${this.dataTypeName}`;
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<${observableType}>`);
		const endpointWithParams = toPascalCase(this.endpoint.replace('{', '${'));
		const returnLine = `return this.geneseService.getGeneseInstance(${this.dataTypeName}).${this.geneseMethod}(\`${endpointWithParams}\`);`;
		this.method.addLine(returnLine);
		this.geneseRequestService.addMethod(this.method);
	}



	addPostMethodToGeneseRequestService(): void {
		this.method.params = `body?: ${this.dataTypeName === 'any' ? 'any' : this.dataTypeName}`;
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<any>`);
		const endpointWithParams = toPascalCase(this.endpoint.replace('{', '${'));
		const geneseInstance = this.dataTypeName === 'any' ? 'undefined' : this.dataTypeName;
		const returnLine = `return this.geneseService.getGeneseInstance(${geneseInstance}).${this.geneseMethod}(\`${endpointWithParams}\`);`;
		this.method.addLine(returnLine);
		this.geneseRequestService.addMethod(this.method);
	}



	addNameAndParamsToMethod(): RequestMethodFactory {
		let methodName = '';
		let params = '';
		let splittedEndpoint = this.endpoint.split('/');
		if (splittedEndpoint.length > 0) {
			for (let i = 1; i < splittedEndpoint.length; i++) {
				if (splittedEndpoint[i].charAt(0) === '{') {
					const path = splittedEndpoint[i].slice(1, -1);
					const param = toPascalCase(path);
					methodName = `${methodName}By${param}`;
					params = `${params}, ${param} = ''`;
				} else {
					methodName = `${methodName}${capitalize(splittedEndpoint[i])}`;
				}
			}
		}
		this.method.name = `${this.action.toLowerCase()}${methodName}`;
		this.method.params = unCapitalize(params.slice(2));
		return this;
	}



	getDataTypeNameFromRefSchema(): RequestMethodFactory {
		this.dataTypeName = getDataTypeNameFromRefSchema(this.refOrPrimitive);
		return this;
	}



	updateGeneseRequestService() {
		this.fileService.updateFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}

	// createPostMethod(action: RestAction, endpoint: string, content: Content): void {
	// 	const method: Method = getRequestMethod(action, endpoint);
	// 	if (content['application/json']?.schema || content['text/plain']?.schema) {
	// 		const schema: any = content['application/json']?.schema ?? content['text/plain'].schema;
	// 		if (schema?.$ref) {
	// 			this.createPostMethodWithRef(method, schema?.$ref, endpoint, GeneseMethod.CREATE_CUSTOM);
	// 		} else if (schema?.type) {
	// 			if (schema.type === 'array') {
	// 				if (schema.items.$ref) {
	// 					this.createPostMethodWithRef(method, schema.items.$ref, endpoint, GeneseMethod.CREATE_CUSTOM);
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		// TODO
	// 	}
	// 	this.fileService.createFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	// }
}
