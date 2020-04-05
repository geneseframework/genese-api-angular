import { InitFactoriesInterface } from './init-factories.interface';
import { PathItem } from '../models/open-api/path-item';
import { RequestMethodFactory } from './request-method.factory';
import { OpenApiService } from '../services/open-api.service';
import { RequestMethod } from '../models/request-method.enum';


export class PathItemFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();


	constructor() {}



	init(pathItem: PathItem, route: string): any {
		this.openApiService.openApi.paths[route] = {};
		if (pathItem?.get) {
			new RequestMethodFactory().addRequestMethod(RequestMethod.GET, route, pathItem);
		}
		if (pathItem?.post) {
			new RequestMethodFactory().addRequestMethod(RequestMethod.POST, route, pathItem);
		}
		if (pathItem?.delete) {
			new RequestMethodFactory().addRequestMethod(RequestMethod.DELETE, route, pathItem);
		}
		if (pathItem?.put) {
			new RequestMethodFactory().addRequestMethod(RequestMethod.PUT, route, pathItem);
		}
		if (pathItem?.patch) {
			new RequestMethodFactory().addRequestMethod(RequestMethod.PATCH, route, pathItem);
		}
	}
}
