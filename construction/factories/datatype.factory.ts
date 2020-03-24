import { Property } from '../models/files/property.model';
import { Schema } from '../models/open-api/schema';
import { FileService } from '../services/file.service';
import { ClassFile } from '../models/files/class-file.model';
import { getDataTypeNameFromRefSchema, toKebabCase } from '../services/tools.service';

export class DatatypeFactory {

	private classFile: ClassFile = new ClassFile();
	private fileService: FileService = new FileService();

	constructor() {
	}


	create(dataTypeName: string, schema: Schema) {
		this.classFile
			.setFileName(`${toKebabCase(dataTypeName)}.datatype.ts`)
			.setFolder(`/genese/genese-api/datatypes/`)
			.setClassDeclaration(dataTypeName);
		this.addPropertiesAndImports(dataTypeName, schema);
		this.fileService.createFile(this.classFile.folder, this.classFile.fileName, this.classFile.content);
	}



	addPropertiesAndImports(dataTypeName: string, schema: Schema): void {
		if (schema.properties) {
			for (let propertyName of Object.keys(schema.properties)) {
				this.classFile.addProperty(`public ${propertyName} ?= ${this.addDefaultValueAndImport(dataTypeName, schema.properties[propertyName])};`);
			}
		} else if (schema.enum) {
			// TODO
		}
	}



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



	getDefaultValueArrays(dataTypeName: string, property: Property): string {
		let defaultValue = '[';
		if (property && property.items) {
			defaultValue += this.addDefaultValueAndImport(dataTypeName, property.items);
		}
		defaultValue += ']';
		return defaultValue;
	}
}
