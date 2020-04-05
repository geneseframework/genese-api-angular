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


export class RequestMethodFactory {

	private action: RequestMethod = RequestMethod.GET;
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



	addRequestMethod(action: RequestMethod, endpoint: string, pathItem: PathItem): void {
		this.init(action, endpoint, pathItem)
			.getContentFromPathItem()
			.getSchemaFromContent()
			.addNameAndParamsToMethod()
			.getGeneseMethod()
			.getRefOrPrimitive()
			.getDataTypeNameFromRefSchema()
			.addImport()
			.addMethodToGeneseRequestService()
			.updateGeneseRequestService();
	}



	init(action: RequestMethod, endpoint: string, pathItem: PathItem): RequestMethodFactory {
		this.action = action;
		this.endpoint = endpoint;
		this.pathItem = pathItem;
		return this;
	}



	getContentFromPathItem(): RequestMethodFactory {
		switch (this.action) {
			case RequestMethod.DELETE:
				this.content = undefined;
				break;
			case RequestMethod.GET:
				this.content = this.pathItem?.get?.responses?.['200']?.['content'];
				break;
			case RequestMethod.PATCH:
			case RequestMethod.POST:
			case RequestMethod.PUT:
				this.content = this.pathItem?.[this.action.toLowerCase()]?.requestBody?.['content'];
				break;
			default: {
				throw 'Incorrect http action verb';
			}
		}
		return this;
	}



	getSchemaFromContent(): RequestMethodFactory {
		const schema: any = this.content?.['application/json']?.schema ?? this.content?.['text/plain']?.schema as OpenApiSchema;
		// console.log('SCHEMA schema', schema);
		this.schema = schema ?? {type: 'any'};
		return this;
	}



	getGeneseMethod(): RequestMethodFactory {
		switch (this.action) {
			case RequestMethod.GET:
				this.geneseMethod = this.schema?.type === 'array' ? GeneseMethod.GET : GeneseMethod.GET_ONE;
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



	getRefOrPrimitive(): RequestMethodFactory {
		if (this.schema?.$ref) {
			this.refOrPrimitive = this.schema?.$ref;
		} else {
			switch (this.schema?.type) {
				case 'array':
					this.refOrPrimitive = this.schema?.items?.$ref;
					break;
				case 'string':
				case 'number':
				case 'boolean':
				case 'any':
					this.refOrPrimitive = this.schema?.type;
					break;
				// case 'any':
				// 	console.log('REF OR PRIMITIVE this.schema', this.schema);
				// 	TODO : remove with genese-angular 1.2
					// this.refOrPrimitive = 'undefined';
					// break;
				default:
					throw 'Unknown schema type';
			}
			// console.log('REF OR PRIMITIVE this.refOrPrimitive', this.refOrPrimitive);
		}
		return this;
	}



	addImport(): RequestMethodFactory {
		if (!isPrimitiveType(this.dataTypeName) && this.refOrPrimitive !== 'any') {
			this.geneseRequestService.addImport(this.dataTypeName, `../datatypes/${toKebabCase(this.dataTypeName)}.datatype`);
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
			this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.dataTypeName}[]>`);
			return `return this.geneseService.getGeneseInstance(${this.geneseInstance}).${this.geneseMethod}(\`${this.endPointWithParams}\`, options);`;
		} else {
			this.method.setDeclaration(this.method.name, this.method.params, `Observable<${this.dataTypeName}>`);
			return `return this.geneseService.getGeneseInstance(${this.geneseInstance}).${this.geneseMethod}(\`${this.endPointWithParams}\`);`;
		}
	}



	setDeclarationAndGetBodyOfPostRequestMethod(): string {
		this.method.params = `body?: ${this.geneseInstance}, ${this.method.params}`;
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<any>`);
		// TODO : refacto this line with genese-angular 1.2 (remove String)
		return `return this.geneseService.instance().${this.geneseMethod}(\`${this.endPointWithParams}\`, body, options);`;
	}



	setDeclarationAndGetBodyOfPutRequestMethod(): string {
		this.method.params = `body?: ${this.dataTypeName === 'any' ? 'any' : this.dataTypeName}, ${this.method.params}`;
		console.log('setDeclarationAndGetBodyOfPutRequestMethod this.method.name', this.method.name);
		this.method.setDeclaration(this.method.name, this.method.params, `Observable<any>`);
		return `return this.geneseService.getGeneseInstance(undefined).${GeneseMethod.PUT}(\`${this.endPointWithParams}\`, body, options);`;
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



	getDataTypeNameFromRefSchema(): RequestMethodFactory {
		this.dataTypeName = getDataTypeNameFromRefSchema(this.refOrPrimitive);
		return this;
	}



	updateGeneseRequestService() {
		this.fileService.updateFile(`/genese/genese-api/services/`, `genese-request.service.ts`, this.geneseRequestService.content);
	}



	get endPointWithParams(): string {
		return toPascalCase(this.endpoint.replace('{', '${'));
	}



	get geneseInstance(): string {
		return this.dataTypeName === 'any' ? 'undefined' : this.dataTypeName;
	}
}
