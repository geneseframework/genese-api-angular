import { InitFactoriesInterface } from './init-factories.interface';
import { Paths } from '../models/open-api/paths';
import { OpenApiService } from '../services/open-api.service';
import { PathItemFactory } from './path-item.factory';


/**
 * Factory for OpenApi Paths objects (Api routes)
 * See https://swagger.io/specification/#pathsObject
 */
export class PathsFactory implements InitFactoriesInterface {

	private openApiService: OpenApiService = OpenApiService.getInstance();      // Instance of OpenApiService


	constructor() {}


    /**
     * Starts the creation of the request services by parsing the paths of the genese-api.json file
     */
    init(target: Paths): any {
		if (target?.paths) {
			this.openApiService.openApi.paths = {};
			for (const path of Object.keys(target.paths)) {
				this.openApiService.next(target.paths[path], PathItemFactory, path);
			}
		}
	}

}
