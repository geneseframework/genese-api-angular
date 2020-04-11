import { FileService } from '../services/file.service';
import { template } from 'handlebars';
import * as Handlebars from 'handlebars';
// import template = Handlebars.template;

const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class HandlebarsFactory {


    private appRoot = appRootPath.toString();                           // Path to the root of the app
    private fileService = new FileService();

    createHandlebars(): void {
        this.fileService.readFile('/construction/templates/datatype.handlebars').then((fileContent: string) => {
            console.log('HF fileContent', fileContent);
            const templateScript = Handlebars.compile(fileContent);
            console.log('HF templateScript', templateScript);
            const context = {imports: 'my import', className: 'DataType'}
            const dataType = templateScript(context);
            console.log('HF dataType', dataType);
        })
    }
}
