import { FileService } from '../services/file.service';
import * as Handlebars from 'handlebars';


export class HandlebarsFactory {


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
