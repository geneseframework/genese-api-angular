import { InitFactoriesInterface } from './init-factories.interface';
import { Schema } from '../models/open-api/schema';
import { DatatypeFactory } from './datatype.factory';
import { PathItem } from '../models/open-api/path-item';
import { GetRequestFactory } from './get-request.factory';
import { OpenApiService } from '../services/open-api.service';
import { MediaType } from '../models/open-api/media-type';
import { Content } from '../models/open-api/content';


export class PathItemFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();


	constructor() {}



	init(pathItem: PathItem, route: string): any {
		this.openApiService.openApi.paths[route] = {};
		if (this.hasGetRequest(pathItem)) {
			// console.log('PATH ITEM pathItem ZZZ', pathItem);
			this.addGetRequest(pathItem, route);
		}
	}



	addGetRequest(target: PathItem, route: string): void {
		const getRequestFactory: GetRequestFactory = new GetRequestFactory();
		getRequestFactory.createRequestMethod('GET', route, target?.get?.responses?.['200']?.['content']);
	}



	createDtos(path: string, pathItem: PathItem) {
		this.createDtoIfMethodExists('get', pathItem);
	}



	createDtoIfMethodExists(method: string, pathItem: PathItem) {
		if (pathItem?.[method]) {
			this.createDto(method, pathItem);
		}
	}



	createDto(method: string, pathItem: PathItem) {
		switch (method) {
			case 'get':
				const dtoGetFactory: GetRequestFactory = new GetRequestFactory();
				// dtoGetFactory.createRequestMethod(pathItem[method]);
				break;
			default:
		}
	}


	createDtoFiles(source: PathItem) {
		for (const path of Object.keys(source)) {
			this.createDtoFile(path, source[path]);
		}
	}



	createDtoFile(path: string, schema: Schema): void {
		const dtoFile = new DatatypeFactory();
		dtoFile.addPropertiesAndImports(path, schema);
		// this.createFile(this.pathGeneseApi + '/dtos/' + key.toLowerCase() + '.dto.model.ts', dtoFile.getContent());
	}



	extractDtos(data: any): Schema {
		try {
			const api = JSON.parse(data);
			return api.components.schemas;
		}
		catch (err) {
			throw err;
		}
	}



	hasGetRequest(pathItem: PathItem): boolean {
		return pathItem?.get?.responses?.['200']?.['content'];
	}
}
