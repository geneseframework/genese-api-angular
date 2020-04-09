import { Config } from '../../services/config.service';


/**
 * Method of a ClassFile
 */
export class Method {

    i = Config.indentation;                 // Indentation by default

	declaration ?= '';                      // Declaration of the method
	body ?= '';                             // Body of the method
	end ?= `${this.i}}`;                    // Last line of the method
	name ?= '';                             // Name of the method
	params ?= '';                           // Parameters of the method
	type ?= '';                             // Type of the method


	constructor() {
	}


    /**
     * Sets the declaration of the method
     * @param name
     * @param params
     * @param type
     */
	setDeclaration(name: string, params = '', type = 'void'): void {
		this.declaration = `${name}(${params}): ${type} {\r\n`;
	}


    /**
     * Set the name, the parameters and the type of the method
     * @param declaration
     */
	setNameParamsType(declaration = ''): void {
		this.name = declaration.slice(0, declaration.indexOf('('));
		this.params = declaration.slice(declaration.indexOf('(') + 1, declaration.indexOf(')'));
		this.type = declaration.slice(declaration.indexOf(':') + 2, declaration.indexOf('{') - 1);
	}


    /**
     * Add a new line to the method
     * @param line
     */
	addLine(line: string): Method {
		this.body = this.body ? `${this.body}${this.i}${line}` : `${this.i}${this.i}${line}`;
		return this;
	}


    /**
     * Returns the complete code of the method as string
     */
	stringify() : string {
		return `${this.declaration}${this.body}\r\n${this.end}\r\n`;
	}
}
