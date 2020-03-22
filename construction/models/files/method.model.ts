export class Method {
	declaration ?= '';
	body ?= '';
	end ?= '\t}';
	name ?= '';
	params ?= '';
	type ?= '';

	constructor() {
	}



	setDeclaration(name: string, params = '', type = 'void'): void {
		this.declaration = `${name}(${params}): ${type} {\r\n`;
	}



	setNameParamsType(declaration = ''): void {
		this.name = declaration.slice(0, declaration.indexOf('('));
		this.params = declaration.slice(declaration.indexOf('(') + 1, declaration.indexOf(')'));
		this.type = declaration.slice(declaration.indexOf(':') + 2, declaration.indexOf('{') - 1);
	}



	stringify() : string {
		return `${this.declaration}${this.body}\r\n${this.end}\r\n`;
	}
}
