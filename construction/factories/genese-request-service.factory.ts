import { ClassFile } from '../models/files/class-file.model';

export class GeneseRequestServiceFactory {

	public classFile = new ClassFile();                         // The ClassFile object which will be used to create the genese-request-service.ts file
	private static instance?: GeneseRequestServiceFactory;      // The singleton instance of GeneseRequestServiceFactory

	private constructor() {}


    /**
     * Singleton pattern : get instance of GeneseRequestServiceFactory
     */
	static getInstance() {
		if (!GeneseRequestServiceFactory.instance) {
			GeneseRequestServiceFactory.instance = new GeneseRequestServiceFactory();
		}
		return GeneseRequestServiceFactory.instance;
	}



    /**
     * Starts the construction of the genese-request-service.ts file
     */
	init(): void {
		this.addImports();
		this.addDeclaration();
		this.addConstructor();
	}


    /**
     * Adds the declaration of the GeneseRequestService class
     */
	addDeclaration(): void {
		this.classFile.setClassDeclaration('GeneseRequestService', '@Injectable()');
	}


    /**
     * Adds the imports of the GeneseRequestService class
     */
	addImports(): void {
		this.classFile.addImport('Observable', 'rxjs');
		this.classFile.addImport('HttpClient', '@angular/common/http');
		this.classFile.addImport('Injectable', '@angular/core');
		this.classFile.addImport('GeneseService, RequestOptions', 'genese-angular');
	}


    /**
     * Adds the constructor of the GeneseRequestService class
     */
	addConstructor(): void {
		this.classFile.addParamToConstructor(`private http: HttpClient,`);
		this.classFile.addParamToConstructor(`private geneseService: GeneseService`);
	}
}
