
const specialChars = new RegExp(/[{}\-_\/]/g);



// ----------------------------------------------------------------------------
//						    Text formatting
// ----------------------------------------------------------------------------


/**
 * Format strings to camelCase (replacing special chars)
 * @param word
 */
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


/**
 * Formats strings to PascalCase (replacing special chars)
 * @param word
 */
export function toPascalCase(word = ''): string {
	return  capitalize(toCamelCase(word));
}


/**
 * Sets the first char to uppercase
 * @param word
 */
export function capitalize(word = ''): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}


/**
 * Sets the first char to lowercase
 * @param word
 */
export function unCapitalize(word = ''): string {
	return word.charAt(0).toLowerCase() + word.slice(1);
}


/**
 * Formats strings to kebab-case (replacing special chars)
 * @param word
 */
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


export function removeSpecialChars(name: string): string {
    return name ? name.replace(specialChars, '') : '';
}



// ----------------------------------------------------------------------------
//						  Files and classes formatting
// ----------------------------------------------------------------------------


/**
 * Returns the name of the DataType for a given reference ($ref: '#/my/schema')
 * @param refSchema
 */
export function getDataTypeNameFromRefSchema(refSchema = ''): string {
    const split = refSchema.split('\/');
    const datatypeName = removeSpecialChars(split.pop());
    const ref = split.slice(0, split.length - 1).concat(datatypeName).join();
	return isPrimitiveType(ref) ? capitalize(ref) : datatypeName;
}


/**
 * Checks if a type is a primitive type
 * @param type
 */
export function isPrimitiveType(type: string): boolean {
	return ['string', 'boolean', 'number', 'String', 'Boolean', 'Number'].includes(type);
}
