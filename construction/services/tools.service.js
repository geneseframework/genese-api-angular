"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var specialChars = new RegExp(/[{}\-_\/]/g);
// ----------------------------------------------------------------------------
//						    Text formatting
// ----------------------------------------------------------------------------
/**
 * Format strings to camelCase (replacing special chars)
 * @param word
 */
function toCamelCase(word) {
    if (word === void 0) { word = ''; }
    var formattedText = '';
    for (var i = 0; i < word.length; i++) {
        if (/[\-_]/.test(word.charAt(i))) {
            if (i < word.length - 1) {
                formattedText += "" + word.charAt(i + 1).toUpperCase();
                i++;
            }
        }
        else {
            formattedText += word.charAt(i);
        }
    }
    return unCapitalize(formattedText);
}
exports.toCamelCase = toCamelCase;
/**
 * Formats strings to PascalCase (replacing special chars)
 * @param word
 */
function toPascalCase(word) {
    if (word === void 0) { word = ''; }
    return capitalize(toCamelCase(word));
}
exports.toPascalCase = toPascalCase;
/**
 * Sets the first char to uppercase
 * @param word
 */
function capitalize(word) {
    if (word === void 0) { word = ''; }
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.capitalize = capitalize;
/**
 * Sets the first char to lowercase
 * @param word
 */
function unCapitalize(word) {
    if (word === void 0) { word = ''; }
    return word.charAt(0).toLowerCase() + word.slice(1);
}
exports.unCapitalize = unCapitalize;
/**
 * Formats strings to kebab-case (replacing special chars)
 * @param word
 */
function toKebabCase(word) {
    if (word === void 0) { word = ''; }
    var formattedText = word.charAt(0).toLowerCase();
    for (var i = 1; i < word.length; i++) {
        if (word.charAt(i).toLowerCase() !== word.charAt(i)) {
            formattedText += "-" + word.charAt(i).toLowerCase();
        }
        else {
            formattedText += word.charAt(i);
        }
    }
    formattedText = formattedText.replace(specialChars, '-');
    return formattedText;
}
exports.toKebabCase = toKebabCase;
function removeSpecialChars(name) {
    return name ? name.replace(specialChars, '') : '';
}
exports.removeSpecialChars = removeSpecialChars;
// ----------------------------------------------------------------------------
//						  Files and classes formatting
// ----------------------------------------------------------------------------
/**
 * Returns the name of the DataType for a given reference ($ref: '#/my/schema')
 * @param refSchema
 */
function getDataTypeNameFromRefSchema(refSchema) {
    if (refSchema === void 0) { refSchema = ''; }
    var split = refSchema.split('\/');
    var datatypeName = removeSpecialChars(split.pop());
    var ref = split.slice(0, split.length - 1).concat(datatypeName).join();
    return isPrimitiveType(ref) ? capitalize(ref) : datatypeName;
}
exports.getDataTypeNameFromRefSchema = getDataTypeNameFromRefSchema;
/**
 * Checks if a type is a primitive type
 * @param type
 */
function isPrimitiveType(type) {
    return ['string', 'boolean', 'number', 'String', 'Boolean', 'Number'].includes(type);
}
exports.isPrimitiveType = isPrimitiveType;
