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


	updateFile(folder, name, data): void {
		fse.writeFileSync(this.appRoot + folder + name, data);
	}


	readFile(path: string): Promise<string> {
		return fse.readFile(this.appRoot + path, 'utf-8');
	}


	deleteFile(path: string): Promise<any> {
	    return fse.remove(this.appRoot + path);
    }
}
