import { Property } from '../models/files/property.model';
import { FileService } from '../services/file.service';
import { ClassFile } from '../models/files/class-file.model';
import { getDataTypeNameFromRefSchema, toKebabCase } from '../services/tools.service';
import { OpenApiSchema } from '../models/open-api/open-api-schema';

/**
 * Factory of DataType files
 */
export class DatatypeFactory {

	private classFile: ClassFile = new ClassFile();             // File object which will be used to construct the file
	private fileService: FileService = new FileService();       // Service managing files

	constructor() {
	}

    /**
     * Create DataType file for a given name and a given OpenApiSchema
     * @param dataTypeName
     * @param schema
     */
	create(dataTypeName: string, schema: OpenApiSchema): void {
		this.classFile
			.setFileName(`${toKebabCase(dataTypeName)}.datatype.ts`)
			.setFolder(`/genese/genese-api/datatypes/`)
			.setClassDeclaration(dataTypeName);
		this.addPropertiesAndImports(dataTypeName, schema);
		this.fileService.createFile(this.classFile.folder, this.classFile.fileName, this.classFile.content);
	}


    /**
     * Adds properties and imports to the datatype file
     * @param dataTypeName
     * @param schema
     */
	addPropertiesAndImports(dataTypeName: string, schema: OpenApiSchema): void {
		if (schema.properties) {
			for (let propertyName of Object.keys(schema.properties)) {
				this.classFile.addProperty(`public ${propertyName} ?= ${this.addDefaultValueAndImport(dataTypeName, schema.properties[propertyName])};`);
			}
		} else if (schema.enum) {
			// TODO
		}
	}


    /**
     * Adds a default value to a given property (mandatory for genese-angular module)
     * Adds corresponding imports
     * @param dataTypeName
     * @param property
     */
	addDefaultValueAndImport(dataTypeName: string, property: Property): string {
		switch (property.type) {
			case 'array':
				return this.getDefaultValueArrays(dataTypeName, property);
			case 'boolean':
				return 'false';
			case 'integer':
			case 'number':
				return '0';
			case 'string':
				return '\'\'';
			default: {
				if (property['$ref']) {
					const dataTypeName = getDataTypeNameFromRefSchema(property['$ref']);
					this.classFile.addImport(dataTypeName, `./${toKebabCase(dataTypeName)}.datatype`);
					return `new ${dataTypeName}()`;
				} else {
					return '\'\'';
				}
			}
		}
	}


    /**
     * Adds default values for properties with type 'array' (mandatory for genese-angular module)
     * @param dataTypeName
     * @param property
     */
	getDefaultValueArrays(dataTypeName: string, property: Property): string {
		let defaultValue = '[';
		if (property && property.items) {
			defaultValue += this.addDefaultValueAndImport(dataTypeName, property.items);
		}
		defaultValue += ']';
		return defaultValue;
	}
}
