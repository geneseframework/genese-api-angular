/**
 * A line corresponding to an import line in a ClassFile
 */
export class ImportLine {
	objectsToImport?: string[] = [];
	from ?= '';
}
