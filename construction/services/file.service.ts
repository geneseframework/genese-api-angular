import { Tools } from './tools';
import { RestAction } from '../models/rest-action.type';
import { Method } from '../models/files/method.model';

const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class FileService {

	private appRoot = appRootPath.toString();

	constructor() {
	}



	createFile(folder, name, data): void {
		let pathFolder = this.appRoot + folder;
		fse.mkdirpSync(pathFolder);
		fse.writeFileSync(pathFolder + name, data);
	}



	readFile(path: string): Promise<string> {
		return fse.readFile(this.appRoot + path, 'utf-8');
	}



	getFileNameWithClassName(className: string): string {
		let fileName = className.charAt(0).toLowerCase();
		for (let i = 1; i < className.length; i++) {
			if (className.charAt(i).toLowerCase() !== className.charAt(i)) {
				fileName += `-${className.charAt(i).toLowerCase()}`;
			} else {
				fileName += className.charAt(i);
			}
		}
		fileName = fileName.replace('_', '-');
		return fileName;
	}


	// ----------------------------------------------------------------------------
	//						Methods for OpenApi routes
	// ----------------------------------------------------------------------------



	getFileNameWithoutExtensionFromOpenApiRoute(schema: string): string {
		let fileName = schema.slice(schema.indexOf('/') + 1)
			.replace('{', 'by-')
			.replace('}', '')
			.replace(/\//g, '-')
			.replace('_', '-');
		const className = schema.slice(schema.lastIndexOf('/') + 1);
		fileName = fileName.slice(0, fileName.lastIndexOf('-') + 1) + this.getFileNameWithClassName(className);
		return fileName;
	}



	getDataTypeNameFromRefSchema(refSchema: string): string {
		return refSchema.slice(refSchema.lastIndexOf('/') + 1);
	}



	getClassNameFromOpenApiRoute(route: string): string {
		let cleanedPath = route.charAt(0) === '/' ? route.slice(1) : route;
		cleanedPath = cleanedPath.replace('{', '');
		cleanedPath = cleanedPath.replace('}', '');
		const splittedFileName = cleanedPath.split('/');
		let className = Tools.capitalize(splittedFileName[0]);
		for (let i = 1; i < splittedFileName.length; i++) {
			className += Tools.capitalize(splittedFileName[i]);
		}
		return className;
	}



	getMethodWithActionAndEndpoint(action: RestAction, endpoint: string): Method {
		if (!endpoint) {
			throw 'No endpoint : impossible to create request method';
		}
		let method: Method = new Method();
		let methodName = '';
		let params = '';
		let splittedEndpoint = endpoint.split('/');
		if (splittedEndpoint.length > 0) {
			for (let i = 1; i < splittedEndpoint.length; i++) {
				if (splittedEndpoint[i].charAt(0) === '{') {
					const path = splittedEndpoint[i].slice(1, -1);
					const param = Tools.capitalize(path);
					methodName = `${methodName}By${param}`;
					params = `${params}, ${param}: string`;
				} else {
					methodName = `${methodName}${Tools.capitalize(splittedEndpoint[i])}`;
				}
			}
		}
		method.name = `${action.toLowerCase()}${methodName}`;
		method.params = Tools.unCapitalize(params.slice(2));
		return method;
	}
}
