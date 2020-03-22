import { Property } from '../models/files/property.model';
import { Content } from '../models/open-api/content';
import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { Tools } from '../services/tools';
import { MediaType } from '../models/open-api/media-type';
import { Reference } from '../models/open-api/reference';
import { RootSchema } from '../models/open-api/root-schema';
import { GeneseRequestServiceFactory } from './genese-request-service.factory';
import { ClassFile } from '../models/files/class-file.model';


export class GetRequestFactory {

	private featureServiceFile = new ClassFile();
	// private className = '';
	private classNameService = '';
	// private content = '';
	private fileService: FileService = new FileService();
	private method?: Method = new Method();
	private observableType = '';
	private route = '';


	constructor() {
	}



	public create(route: string, content: Content) {
		this.route = route;
		this.featureServiceFile
			.setFileName(this.fileService.getFileNameWithoutExtensionFromOpenApiRoute(route))
			.setClassName(`${this.fileService.getClassNameFromOpenApiRoute(route)}Service`)
			.setClassDeclaration(this.featureServiceFile.className, '@Injectable()');
		this.addImports();
		this.addDeclaration();
		this.addConstructor();
		for (const mediaType of Object.keys(content)) {
			this.addMediaTypes(content[mediaType]);
		}
		this.fileService.createFile('/genese/genese-api/services/', `${this.featureServiceFile.fileName}.service.ts`, this.featureServiceFile.content);
		this.addMethodToGeneseRequestService();
	}



	// public create(route: string, content: Content) {
	// 	this.route = route;
	// 	this.featureService.setFileName(this.fileService.getFileNameWithoutExtensionFromOpenApiRoute(route))
	// 	this.setFileName();
	// 	this.setClassName();
	// 	this.addImports();
	// 	this.addDeclaration();
	// 	this.addConstructor();
	// 	this.featureService.setClassDeclaration(this.classNameService, '@Injectable()');
	// 	for (const mediaType of Object.keys(content)) {
	// 		this.addMediaTypes(content[mediaType]);
	// 	}
	// 	this.fileService.createFile('/genese/genese-api/services/', `${this.featureService.fileName}.service.ts`, this.featureService.getContent());
	// 	this.addMethodToGeneseRequestService();
	// }



	addImports(): void {
		this.featureServiceFile.addImport('Observable', 'rxjs');
		this.featureServiceFile.addImport('HttpClient', '@angular/common/http');
		this.featureServiceFile.addImport('Injectable', '@angular/core');
		this.featureServiceFile.addImport('GeneseEnvironmentService, GeneseService', 'genese-angular');
	}



	addDeclaration(): void {
		this.featureServiceFile.setClassDeclaration(this.classNameService, '@Injectable()');
	}



	addConstructor(): void {
		this.featureServiceFile.addParamToConstructor(`private http: HttpClient,`);
		this.featureServiceFile.addParamToConstructor(`private geneseEnvironmentService: GeneseEnvironmentService,`);
		this.featureServiceFile.addParamToConstructor(`private geneseService: GeneseService,`);
	}



	addMethod(geneseMethod: string, dtoName: string): void {
		this.method.name = `${geneseMethod}${this.featureServiceFile.className}`;
		this.method.setDeclaration(this.method.name, '', `Observable<${this.observableType}>`);
		this.featureServiceFile.addMethod(this.method);
		const returnLine = `return this.geneseService.getGeneseInstance(${dtoName}).${geneseMethod}Custom('${this.route}') as any;`;
		this.featureServiceFile.addLineToMethod(this.method.name, returnLine);
		this.featureServiceFile.addImport(dtoName, `../dtos/${this.fileService.getFileNameWithClassName(dtoName)}.dto`);
	}



	addMediaTypes(mediaType: MediaType): void {
		if (mediaType.schema) {
			this.getReferenceOrSchema(mediaType.schema);
		}
	}



	getReferenceOrSchema(schema: Reference | RootSchema): void {
		if (schema['$ref']) {
			this.getReference(schema['$ref'] as string);
		} else if (schema['type']) {
			this.getRootSchema(schema as RootSchema);
		}
	}



	getReference(referenceSchema: string): void {
		this.observableType = this.getDtoName(referenceSchema);
		this.addMethod('get', this.getDtoName(referenceSchema));
	}



	getRootSchema(rootSchema: RootSchema): void {
		switch (rootSchema.type) {
			case 'array':
				if (rootSchema.items) {
					if (rootSchema.items.$ref) {
						this.observableType = this.getDtoName(`${this.getDtoName(rootSchema.items.$ref)}[]`);
						this.addMethod('get', this.getDtoName(rootSchema.items.$ref));
					}
				}
				break;
			default: {}
		}
	}



	getDtoName(referenceSchema: string): string {
		const splittedReferenceSchema = referenceSchema.split('/');
		return splittedReferenceSchema[splittedReferenceSchema.length - 1];
	}



	addMethodToGeneseRequestService() {
		const geneseRequestService = GeneseRequestServiceFactory.getInstance().classFile;
		geneseRequestService.addImport(this.observableType, `../dtos/${this.observableType}`);
		geneseRequestService.addLineToMethod('init', `this.${this.method.name} = this.${Tools.unCapitalize(this.classNameService)}.${this.method.name};`);
		geneseRequestService.addProperty(`public ${this.method.name}: () => Observable<${this.observableType}>;`);
		this.fileService.createFile(`/genese/genese-api/services/`, `genese-request.service.ts`, geneseRequestService.content);
	}
}
