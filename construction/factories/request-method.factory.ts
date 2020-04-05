import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';
import { RequestMethod } from '../models/request-method.enum';
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

export interface SideProperties {
	content?: Content,
	dataTypeName?: string,
	schema?: OpenApiSchema,
	refOrPrimitive?: string
}

export enum SideRequest {
	CLIENT = 'clientSide',
	SERVER = 'serverSide'
}

export class RequestMethodFactory {

	private action: RequestMethod = RequestMethod.GET;
	private clientSide: SideProperties = {};
	private endpoint = '';
	private fileService: FileService = new FileService();
	private geneseMethod: GeneseMethod;
	private geneseRequestService = new ClassFile();
	private method: Method = new Method();
	private pathItem: PathItem = new PathItem();
	private serverSide: SideProperties = {};


	constructor() {
		this.geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
	}



	addRequestMethod(action: RequestMethod, endpoint: string, pathItem: PathItem): void {
		this.init(action, endpoint, pathItem)
			.addNameAndParamsToMethod()
			.getContentsFromPathItem()
			.addProperties(SideRequest.CLIENT)
			.addProperties(SideRequest.SERVER)
			.getGeneseMethod()
			.addMethodToGeneseRequestService()
			.updateGeneseRequestService();
	}



	// ----------------------------------------------------------------------------
	//		      Creates request method and get contents from pathItem
	// ----------------------------------------------------------------------------




	init(action: RequestMethod, endpoint: string, pathItem: PathItem): RequestMethodFactory {
		this.action = action;
		this.endpoint = endpoint;
		this.pathItem = pathItem;
		return this;
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
		this.method.params = params ? `${unCapitalize(params.slice(2))}, options?: RequestOptions` : `options?: RequestOptions`;
		return this;
	}



	getContentsFromPathItem(): RequestMethodFactory {
		this.clientSide.content = this.pathItem?.[this.action.toLowerCase()]?.requestBody?.['content'];
		this.serverSide.content = this.pathItem?.[this.action.toLowerCase()]?.responses?.['200']?.['content'];
		return this;
	}



	// ----------------------------------------------------------------------------
	//		Add properties from client side and server side informations
	// ----------------------------------------------------------------------------




	addProperties(side: SideRequest): RequestMethodFactory {
		this.getSchemaFromContent(side)
			.getRefOrPrimitive(side)
			.getDataTypeNameFromRefSchema(side)
			.addImport(side);
		return this;
	}



	getSchemaFromContent(side: SideRequest): RequestMethodFactory {
		let schema: any = this[side]?.content?.['application/json']?.schema ?? this[side]?.['text/plain']?.schema as OpenApiSchema;
		this[side].schema = schema ?? {type: 'any'};
		return this;
	}



	getRefOrPrimitive(side: SideRequest): RequestMethodFactory {
		if (this[side].schema) {
			if (this[side].schema?.$ref) {
				this[side].refOrPrimitive = this[side].schema?.$ref;
			} else {
				switch (this[side].schema?.type) {
					case 'array':
						this[side].refOrPrimitive = this[side].schema?.items?.$ref;
						break;
					case 'string':
					case 'number':
					case 'boolean':
					case 'any':
						this[side].refOrPrimitive = this[side].schema?.type;
						break;
					default:
						throw Error('Incorrect schema type');
				}
			}
		}
		return this;
	}



	addImport(side: SideRequest): RequestMethodFactory {
		if (!isPrimitiveType(this[side].dataTypeName) && this[side].refOrPrimitive !== 'any') {
			this.geneseRequestService.addImport(this[side].dataTypeName, `../datatypes/${toKebabCase(this[side].dataTypeName)}.datatype`);
		}
		return this;
	}



	getDataTypeNameFromRefSchema(side: SideRequest): RequestMethodFactory {
		this[side].dataTypeName = getDataTypeNameFromRefSchema(this[side].refOrPrimitive);
		return this;
	}



	// ----------------------------------------------------------------------------
	//					   Add method to GeneseRequestService
	// ----------------------------------------------------------------------------




	getGeneseMethod(): RequestMethodFactory {
		switch (this.action) {
			case RequestMethod.GET:
				this.geneseMethod = this.serverSide.schema?.type === 'array' ? GeneseMethod.GET : GeneseMethod.GET_ONE;
				break;
			case RequestMethod.POST:
				this.geneseMethod = GeneseMethod.POST;
				break;
			case RequestMethod.PUT:
				this.geneseMethod = GeneseMethod.PUT;
				break;
		}
		return this;
	}



	addMethodToGeneseRequestService(): RequestMethodFactory {
		let bodyMethod = '';
		switch (this.action) {
			case RequestMethod.DELETE:
				bodyMethod = this.setDeclarationAndGetBodyOfDeleteRequestMethod();
				break;
			case RequestMethod.GET:
				bodyMethod = this.setDeclarationAndGetBodyOfGetRequestMethod();
				break;
			case RequestMethod.POST:
				bodyMethod = this.setDeclarationAndGetBodyOfPostRequestMethod();
				break;
			case RequestMethod.PUT:
				bodyMethod = this.setDeclarationAndGetBodyOfPutRequestMethod();
				break;
		}
		this.method.addLine(bodyMethod);
		this.geneseRequestService.addMethod(this.method);
		return this;
	}



	setDeclarationAndGetBodyOfDeleteRequestMethod(): string {
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<any>`);
		// TODO : refacto this line with genese-angular 1.2 (remove String)
		return `return this.geneseService.getGeneseInstance(undefined).${GeneseMethod.DELETE}(\`${this.endPointWithParams}\`);`;
	}



	setDeclarationAndGetBodyOfGetRequestMethod(): string {
		if (this.geneseMethod === GeneseMethod.GET) {
			this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.serverSide.dataTypeName}[]>`);
			return `return this.geneseService.getGeneseInstance(${this.serverSide.dataTypeName}).${this.geneseMethod}(\`${this.endPointWithParams}\`, options);`;
		} else {
			this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.serverSide.dataTypeName}>`);
			return `return this.geneseService.getGeneseInstance(${this.serverSide.dataTypeName}).${this.geneseMethod}(\`${this.endPointWithParams}\`);`;
		}
	}



	setDeclarationAndGetBodyOfPostRequestMethod(): string {
		this.method.params = `body?: ${this.clientSide.dataTypeName}, ${this.method.params}`;
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.serverSide.dataTypeName}>`);
		// TODO : refacto this line with genese-angular 1.2 (remove String)
		return `return this.geneseService.instance().${this.geneseMethod}(\`${this.endPointWithParams}\`, body, options);`;
	}



	setDeclarationAndGetBodyOfPutRequestMethod(): string {
		this.method.params = `body?: ${this.clientSide.dataTypeName === 'any' ? 'any' : this.clientSide.dataTypeName}, ${this.method.params}`;
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.serverSide.dataTypeName}>`);
		return `return this.geneseService.getGeneseInstance(undefined).${GeneseMethod.PUT}(\`${this.endPointWithParams}\`, body, options);`;
	}



	updateGeneseRequestService() {
		this.fileService.updateFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}



	get endPointWithParams(): string {
		return toPascalCase(this.endpoint.replace('{', '${'));
	}
}
