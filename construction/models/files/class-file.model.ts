import { Method } from './method.model';
import { ImportLine } from './import-line.model';
import { Config } from '../../services/config.service';
import { WARNING_GENERATED_CODE } from './warning';

/**
 * This class contains all elements defining a class :
 *      - imports
 *      - declaration
 *      - properties
 *      - constructor
 *      - methods
 *  This class also contains methods managing these different elements
 */
export class ClassFile {


    private i = Config.indentation;                     // Indentation of the repository

    private _comments ?= '';                            // Comments on top the file
	private _constructorInstructions ?= '';             // Body of the constructor
	private _constructorParams ?= '';                   // Params of the constructor
	private _constructorPart ?= '';                     // Part of the file containing the constructor
	private _content ?= '';                             // All content of the file
	private _declarationPart ?= '';                     // Part of the file containing the declaration of the class
	private _endOfFilePart ?= '\r\n}\r\n';              // Part of the file containing the last lines of the file
	private _fileName ?= '';                            // File name
	private _fileFolder ?= '';                          // Folder containing the file
	private _importLines?: ImportLine[] = [];           // Array of lines which are on the imports
	private _methods?: Method[] = [];                   // Array of the methods of the class
	private _methodsPart ?= '';                         // Part of the file containing the methods
	private _propertiesPart ?= `\r\n${this.i}`;         // Part of the file containing the properties


	constructor() {
	}


	// ----------------------------------------------------------------------------
	//							Imports generation
	// ----------------------------------------------------------------------------


    /**
     * Add a line on the imports part
     * @param objectToImport    {string} object imported
     * @param from              {string} module or path where is the object to import
     */
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


    /**
     * Get the part "imports" of the file
     * @private
     */
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


    /**
     * Set the declaration part of the class
     * @param className
     * @param decorator
     */
	setClassDeclaration(className: string, decorator?: string): ClassFile {
		const firstLine: string = decorator ? `\r\n${decorator}\r\n` : '\r\n';
		this._declarationPart = `${firstLine}export class ${className} {\r\n\r\n`;
		return this;
	}



	// ----------------------------------------------------------------------------
	//							Properties generation
	// ----------------------------------------------------------------------------


    /**
     * Adds a property to part "properties" of the class
     * @param line
     */
	addProperty(line = ''): void {
		this._propertiesPart = `${this._propertiesPart}${line}\r\n${this.i}`;
	}



	// ----------------------------------------------------------------------------
	//							Constructor generation
	// ----------------------------------------------------------------------------


    /**
     * Adds a constructor to the class
     */
	setConstructorPart(): void {
		this._constructorPart = `\r\n${this.i}constructor(\r\n${this.i}${this.i}${this._constructorParams}) {\r\n${this.i}${this.i}${this._constructorInstructions}}\r\n`;
	}


    /**
     * Adds a param to the constructor
     * @param param {string} the name of the param with its type and a comma at the end
     */
	addParamToConstructor(param = ''): void {
		this._constructorParams = `${this._constructorParams}${param}\r\n${this.i}${this.i}`;
		this.setConstructorPart();
	}



	// ----------------------------------------------------------------------------
	//							 Methods generation
	// ----------------------------------------------------------------------------


    /**
     * Set the part "methods" of the file with all the methods contained in the class
     */
	setMethodsPart(): void {
		this._methodsPart = '';
		for (const method of this._methods) {
			this._methodsPart += `\r\n\r\n\r\n${this.i}${method.stringify()}`;
		}
	}


    /**
     * Adds a method to the class
     * @param method: {Method} the method to add
     */
	addMethod(method: Method): void {
		this._methods.push(method);
		this.setMethodsPart();
	}


	// ----------------------------------------------------------------------------
	//					    File name, Class name and Folder
	// ----------------------------------------------------------------------------


    /**
     * Sets the name of the file
     * @param fileName
     */
	setFileName(fileName: string): ClassFile {
		this._fileName = fileName;
		return this;
	}


    /**
     * Gets the name of the file
     */
	get fileName(): string {
		return this._fileName;
	}



    /**
     * Sets the folder of the file
     * @param pathFolder
     */
	setFolder(pathFolder: string): ClassFile {
		this._fileFolder = pathFolder;
		return this;
	}


    /**
     * Gets the folder of the file
     */
	get folder(): string {
		return this._fileFolder;
	}


	// ----------------------------------------------------------------------------
	//							File content
	// ----------------------------------------------------------------------------


    /**
     * Gets the content of the file
     */
	get content(): string {
		this._content = `${WARNING_GENERATED_CODE}${this._importsPart}${this._declarationPart}${this._propertiesPart}` +
			`${this._constructorPart}${this._methodsPart}${this._endOfFilePart}`;
		return this._content;
	}
}
