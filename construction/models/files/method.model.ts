import { Config } from '../../services/config.service';



export class Method {
    i = Config.indentation;
	declaration ?= '';
	body ?= '';
	end ?= `${this.i}}`;
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



	addLine(line: string): Method {
		this.body = this.body ? `${this.body}${this.i}${line}` : `${this.i}${this.i}${line}`;
		return this;
	}



	stringify() : string {
		return `${this.declaration}${this.body}\r\n${this.end}\r\n`;
	}
}
