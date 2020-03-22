import { Method } from './method.model';
import { ImportLine } from './import-line.model';

export class ClassFile {

	private _className ?= '';
	private _constructorInstructions ?= '';
	private _constructorParams ?= '';
	private _constructorPart ?= '';
	private _content ?= '';
	private _declarationPart ?= '';
	private _endOfFilePart ?= '\r\n}\r\n';
	private _fileName ?= '';
	private _fileFolder ?= '';
	private _importLines?: ImportLine[] = [];
	private _methods?: Method[] = [];
	private _methodsPart ?= '';
	private _propertiesPart ?= '\r\n\t';


	constructor() {
	}



	// ----------------------------------------------------------------------------
	//							Imports generation
	// ----------------------------------------------------------------------------




	addImport(objectToImport: string, from: string): void {
		const existingFrom = this._importLines.find(e => e.from === from);
		if (existingFrom) {
			if (!existingFrom.objectsToImport.includes(objectToImport)) {
				this._importLines[this._importLines.findIndex(e => e.from === from)].objectsToImport.push(objectToImport);
			}
		} else {
			this._importLines.push({objectsToImport: [objectToImport], from: from});
		}
	}



	private get _importsPart(): string {
		let importsPart = '';
		for (const importLine of this._importLines) {
			let objectsToImport = '';
			for (const objectToImport of importLine.objectsToImport) {
				objectsToImport = `${objectsToImport}${objectToImport}, `;
			}
			objectsToImport = objectsToImport.slice(0, objectsToImport.length - 2);
			importsPart = `${importsPart}import { ${objectsToImport} } from '${importLine.from}';\r\n`;
		}
		return importsPart;
	}



	// ----------------------------------------------------------------------------
	//							Declaration generation
	// ----------------------------------------------------------------------------




	setClassDeclaration(className: string, decorator?: string): ClassFile {
		const firstLine: string = decorator ? `\r\n${decorator}\r\n` : '\r\n';
		this._declarationPart = `${firstLine}export class ${className} {\r\n\r\n`;
		return this;
	}



	// ----------------------------------------------------------------------------
	//							Properties generation
	// ----------------------------------------------------------------------------




	addProperty(line = ''): void {
		this._propertiesPart = `${this._propertiesPart}${line}\r\n\t`;
	}



	// ----------------------------------------------------------------------------
	//							Constructor generation
	// ----------------------------------------------------------------------------


	setConstructorPart(): void {
		this._constructorPart = `\r\n\tconstructor(\r\n\t\t${this._constructorParams}) {\r\n\t\t${this._constructorInstructions}}\r\n`;
	}



	addInstructionToConstructor(line = ''): void {
		this._constructorInstructions = `${this._constructorInstructions}${line}\r\n\t`;
		this.setConstructorPart();
	}



	addParamToConstructor(param = ''): void {
		this._constructorParams = `${this._constructorParams}${param}\r\n\t\t`;
		this.setConstructorPart();
	}



	// ----------------------------------------------------------------------------
	//							 Methods generation
	// ----------------------------------------------------------------------------



	setMethodsPart(): void {
		this._methodsPart = '';
		for (const method of this._methods) {
			this._methodsPart += `\r\n\r\n\r\n\t${method.stringify()}`;
		}
	}



	addMethod(method: Method): void {
		this._methods.push(method);
		this.setMethodsPart();
	}



	addLineToMethodAlreadyExisting(methodName: string, line: string) {
		let method: Method = this._methods.find(e => e.name === methodName);
		if (method) {
			method.body = method.body ? `${method.body}\t${line}` : `\t\t${line}`;
		}
		this.setMethodsPart();
	}


	// ----------------------------------------------------------------------------
	//					    File name, Class name and Folder
	// ----------------------------------------------------------------------------



	setFileName(fileName: string): ClassFile {
		this._fileName = fileName;
		return this;
	}



	get fileName(): string {
		return this._fileName;
	}



	setClassName(className: string): ClassFile {
		this._className = className;
		return this;
	}



	get className(): string {
		return this._className;
	}



	setFolder(pathFolder: string): ClassFile {
		this._fileFolder = pathFolder;
		return this;
	}



	get folder(): string {
		return this._fileFolder;
	}


	// ----------------------------------------------------------------------------
	//							File content
	// ----------------------------------------------------------------------------



	get content(): string {
		this._content = `${this._importsPart}${this._declarationPart}${this._propertiesPart}` +
			`${this._constructorPart}${this._methodsPart}${this._endOfFilePart}`;
		return this._content;
	}
}
