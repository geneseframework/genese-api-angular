const fse = require('fs-extra');
const appRootPath = require('app-root-path');

export class Config {


    public static indentation: string;
    private static instance: Config;


    constructor() {
    }



    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }



    setConfig(): Promise<any> {
        return this.setIndentation();
    }



    setIndentation(): Promise<any> {
        const appRoot = appRootPath.toString();
        let indent_style = '';
        let size = 1;
        let indentation = '';
        return fse.readFile(`${appRoot}/.editorconfig`).then((contentFile: string) => {
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
            Config.indentation = indentation;
            return;
        }).catch(e => {
            console.log('Warning : get indentation from .editorconfig failed. ', e);
            return '    ';
        });
    }
}
