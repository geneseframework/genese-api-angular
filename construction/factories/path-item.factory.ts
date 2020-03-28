import { InitFactoriesInterface } from './init-factories.interface';
import { PathItem } from '../models/open-api/path-item';
import { RequestMethodFactory } from './request-method.factory';
import { OpenApiService } from '../services/open-api.service';


export class PathItemFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();
	private requestMethodFactory: RequestMethodFactory = new RequestMethodFactory();


	constructor() {}



	init(pathItem: PathItem, route: string): any {
		this.openApiService.openApi.paths[route] = {};
		if (pathItem?.get) {
			this.requestMethodFactory.addGetRequest(route, pathItem);
		}
		if (pathItem?.post) {
			const zzz = new RequestMethodFactory();
			zzz.addPostRequest(route, pathItem);
		}
	}
}
