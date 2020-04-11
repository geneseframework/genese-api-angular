import { InitFactoriesInterface } from './init-factories.interface';
import { OpenApiService } from '../services/open-api.service';
import { ComponentsFactory } from './components.factory';
import { PathsFactory } from './paths.factory';
import { FileService } from '../services/file.service';
import { toKebabCase } from '../services/tools.service';

/**
 * Factory of DataTypes and Endpoints with the genese-api.json file
 * Format of OpenApi objects : see https://swagger.io/specification/#oasObject
 */
export class OpenApiFactory implements InitFactoriesInterface {

    private fileService: FileService = new FileService();
	private openApiService: OpenApiService = OpenApiService.getInstance();      // Instance of OpenApiService


	constructor() {}


    /**
     * Starts the creation of the DataTypes and of the request services of genese-request.service.ts file
     */
	init() {
		this.openApiService.openApi = {openapi: this.openApiService.openApiJsonFile.openapi};
        this.createEndpointsServices();
		this.createDatatypes();
		this.shakeTreeDatatypes();
	}


    /**
     * Creates the DataTypes
     */
	createDatatypes(): void {
		this.openApiService.next(this.openApiService.openApiJsonFile, ComponentsFactory);
	}


    /**
     * Creates the request services of genese-request.service.ts file
     */
	createEndpointsServices(): void {
		this.openApiService.next(this.openApiService.openApiJsonFile, PathsFactory);
	}


    /**
     * Remove all datatype files which are not linked to any other datatype file or any endpoint
     */
    shakeTreeDatatypes(): void {
        if (this.openApiService.datatypeNames) {
            this.openApiService.datatypeNames.forEach((name: string) => {
                if (!this.openApiService.refLinks.has(name)) {
                    const fileToDelete = `/genese/genese-api/datatypes/${toKebabCase(name)}.datatype.ts`;
                    this.fileService.deleteFile(fileToDelete).then(() => {
                        console.warn(`WARNING: The Datatype OpenApi object ${name} is not linked to any Datatype or endpoint. The file '${toKebabCase(name)}.datatype.ts' has been deleted.`);
                    });
                }
            })
        }
    }
}
