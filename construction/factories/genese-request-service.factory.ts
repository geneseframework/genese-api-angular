import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { ClassFile } from '../models/files/class-file.model';

export class GeneseRequestServiceFactory {

	public classFile = new ClassFile();
	private fileService: FileService = new FileService();
	private static instance?: GeneseRequestServiceFactory;

	private constructor() {

	}

	static getInstance() {
		if (!GeneseRequestServiceFactory.instance) {
			GeneseRequestServiceFactory.instance = new GeneseRequestServiceFactory();
		}
		return GeneseRequestServiceFactory.instance;
	}

	init(): void {
		this.addImports();
		this.addDeclaration();
		this.addConstructor();
		this.addMethods();
		// return this.classFile.getContent();
		// this.fileService.createFile(`/genese/genese-api/services/genese-request.service.ts`, this.classFile.getContent());
	}



	addDeclaration(): void {
		this.classFile.setClassDeclaration('GeneseRequestService', '@Injectable()');
	}



	addImports(): void {
		this.classFile.addImport('Observable', 'rxjs');
		this.classFile.addImport('HttpClient', '@angular/common/http');
		this.classFile.addImport('Injectable', '@angular/core');
		this.classFile.addImport('GeneseEnvironmentService', 'genese-angular');
	}



	addConstructor(): void {
		this.classFile.addParamToConstructor(`private http: HttpClient,`);
		this.classFile.addParamToConstructor(`private geneseEnvironmentService: GeneseEnvironmentService,`);
		this.classFile.addInstructionToConstructor(`this.init();`);
	}



	addMethods(): void {
		let method: Method = new Method();
		method.setDeclaration('init');
		this.classFile.addMethod(method);
	}


}
