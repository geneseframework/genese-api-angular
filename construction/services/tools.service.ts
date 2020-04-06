const fse = require('fs-extra');
const appRootPath = require('app-root-path');

const specialChars = new RegExp(/[{}\-_\/]/);



// ----------------------------------------------------------------------------
//						    Text formatting
// ----------------------------------------------------------------------------




export function toCamelCase(word = ''): string {
	let formattedText = '';
	for (let i = 0; i < word.length; i++) {
		if (/[\-_]/.test(word.charAt(i))) {
			if (i < word.length - 1) {
				formattedText += `${word.charAt(i + 1).toUpperCase()}`;
				i ++;
			}
		} else {
			formattedText += word.charAt(i);
		}
	}
	return unCapitalize(formattedText);
}



export function toPascalCase(word = ''): string {
	return  capitalize(toCamelCase(word));
}



export function capitalize(word = ''): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}



export function unCapitalize(word = ''): string {
	return word.charAt(0).toLowerCase() + word.slice(1);
}



export function toKebabCase(word = ''): string {
	let formattedText = word.charAt(0).toLowerCase();
	for (let i = 1; i < word.length; i++) {
		if (word.charAt(i).toLowerCase() !== word.charAt(i)) {
			formattedText += `-${word.charAt(i).toLowerCase()}`;
		} else {
			formattedText += word.charAt(i);
		}
	}
	formattedText = formattedText.replace(specialChars, '-');
	return formattedText;
}



// ----------------------------------------------------------------------------
//						  Files and classes formatting
// ----------------------------------------------------------------------------



export function getDataTypeNameFromRefSchema(refSchema = ''): string {
	return isPrimitiveType(refSchema) ? capitalize(refSchema) : refSchema.slice(refSchema.lastIndexOf('/') + 1);
}

export function isPrimitiveType(type: string): boolean {
	return ['string', 'boolean', 'number', 'String', 'Boolean', 'Number'].includes(type);
}



// ----------------------------------------------------------------------------
//						  Indentation
// ----------------------------------------------------------------------------



export function indent(): string {
    const appRoot = appRootPath.toString();
    let indent_style = '';
    let size = 1;
    let indentation = '';
    return fse.readFile(`${appRoot}/.editorconfig`).then(contentFile => {
        const lines = contentFile.toString().split(`\n`);
        for (const line of lines) {
            if (line.indexOf('indent_style') > -1) {
                indent_style = line.indexOf('space') > -1 ? ' ' : '\t';
            }
            if (line.indexOf('indent_size') > -1) {
                size = Number(line.split('=')?.[1].trim());
            }
        }
        if (indent_style && size) {
            for (let i = 0; i < size; i++) {
                indentation = `${indentation}${indent_style}`;
            }
        }
        return indentation;
    }).catch(e => {
        console.log('Error : ', e);
        console.log('indent = 4 spaces');
        return '    ';
    });
}

