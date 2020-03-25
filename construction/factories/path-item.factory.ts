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
			this.addGetRequest(pathItem, route);
		}
		if (this.hasPostRequest(pathItem)) {
			this.addPostRequest(pathItem, route);
		}
	}



	addGetRequest(target: PathItem, route: string): void {
		const getRequestFactory: GetRequestFactory = new GetRequestFactory();
		getRequestFactory.createGetMethod('GET', route, target?.get?.responses?.['200']?.['content']);
	}



	hasGetRequest(pathItem: PathItem): boolean {
		return pathItem?.get?.responses?.['200']?.['content'];
	}



	addPostRequest(target: PathItem, route: string): void {
		const getRequestFactory: GetRequestFactory = new GetRequestFactory();
		getRequestFactory.createPostMethod('POST', route, target?.post?.requestBody?.['content']);
	}



	hasPostRequest(pathItem: PathItem): boolean {
		return pathItem?.post?.requestBody?.['content'];
	}
}
