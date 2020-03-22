import { FileService } from '../services/file.service';
import { Method } from '../models/files/method.model';
import { ClassFile } from '../models/files/class-file.model';


// -------------------------------------------------------------------------------
// TODO : File not used for now. Will check its utility later
// -------------------------------------------------------------------------------

export class ClassFileFactory {

	private classFile: ClassFile = new ClassFile();
	public contentFile ?= '';
	private fileService?: FileService = new FileService();
	private partOfContentFile ?= '';



	constructor() {
	}



	// ----------------------------------------------------------------------------
	//					New ClassService from existing file
	// ----------------------------------------------------------------------------




	createClassServiceFromFile(path: string): Promise<ClassFile> {
		 return this.fileService.readFile(path).then(contentFile => {
			 this.contentFile = contentFile;
			 this.partOfContentFile = this.contentFile;
			 this.addImports()
				 .addDeclaration()
				 .addProperties()
				 .addConstructor()
				 .addMethods();
			 return this.classFile;
		});
	}



	addImports(): ClassFileFactory {
		const beforeExportClass = this.partOfContentFile.slice(0, this.partOfContentFile.indexOf('export class'));
		this.classFile.importsPart = beforeExportClass.slice(0, beforeExportClass.lastIndexOf('@'));
		this.partOfContentFile = this.partOfContentFile.slice(beforeExportClass.lastIndexOf('@'));
		return this;
	}



	addDeclaration(): ClassFileFactory {
		this.classFile.declarationPart = `${this.partOfContentFile.slice(0, this.partOfContentFile.indexOf('{') + 1)}\r\n`;
		this.partOfContentFile = this.partOfContentFile.slice(this.partOfContentFile.indexOf('{') + 1);
		return this;
	}



	addProperties(): ClassFileFactory {
		this.classFile.propertiesPart = `${this.partOfContentFile.slice(0, this.partOfContentFile.indexOf('constructor') - 3)}`;
		this.partOfContentFile = this.partOfContentFile.slice(this.partOfContentFile.indexOf('constructor') - 3);
		return this;
	}



	addConstructor(): ClassFileFactory {
		this.classFile.constructorPart = `${this.partOfContentFile.slice(0, this.partOfContentFile.indexOf('}') + 1)}\r\n`;
		this.partOfContentFile = this.partOfContentFile.slice(this.partOfContentFile.indexOf('}'));
		return this;
	}



	addMethods(): ClassFileFactory {
		this.partOfContentFile = this.partOfContentFile.slice(1, this.partOfContentFile.lastIndexOf('}'));
		while (this.partOfContentFile.indexOf('{') > 0) {
			this.addLastMethod(this.partOfContentFile);
		}
		this.partOfContentFile.lastIndexOf('}');
		this.classFile.setMethodsPart();
		return this;
	}



	addLastMethod(text: string): void {
		let method: Method = new Method();
		const textBeforeLastBracket = text.slice(0, text.lastIndexOf('}'));
		let numberOfRightBrackets = 1;
		let charIndex = this.partOfContentFile.length;
		while (numberOfRightBrackets > 0 && charIndex > 0) {
			if (textBeforeLastBracket.charAt(charIndex) === '}') {
				numberOfRightBrackets ++;
			}
			if (textBeforeLastBracket.charAt(charIndex) === '{') {
				numberOfRightBrackets --;
			}
			charIndex --;
		}
		method.body = textBeforeLastBracket.slice(charIndex + 2);
		const textBeforeFirstBracketLastMethod = textBeforeLastBracket.slice(0, charIndex + 2);
		method.declaration = textBeforeFirstBracketLastMethod.slice(textBeforeFirstBracketLastMethod.lastIndexOf('\t') + 1);
		method.setNameParamsType(method.declaration);
		this.partOfContentFile = textBeforeFirstBracketLastMethod.slice(0, textBeforeFirstBracketLastMethod.lastIndexOf('\t'));
		this.classFile.addMethod(method);
	}
}
