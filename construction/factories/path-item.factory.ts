import { InitFactoriesInterface } from './init-factories.interface';
import { PathItem } from '../models/open-api/path-item';
import { RequestMethodFactory } from './request-method.factory';
import { OpenApiService } from '../services/open-api.service';


export class PathItemFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();


	constructor() {}



	init(pathItem: PathItem, route: string): any {
		this.openApiService.openApi.paths[route] = {};
		if (pathItem?.get) {
			new RequestMethodFactory().addRequestMethod('GET', route, pathItem);
		}
		if (pathItem?.post) {
			new RequestMethodFactory().addRequestMethod('POST', route, pathItem);
		}
	}
}
