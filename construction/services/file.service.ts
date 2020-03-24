import { capitalize, toKebabCase, unCapitalize } from './tools.service';
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
}
