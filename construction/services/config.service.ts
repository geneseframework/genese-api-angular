const fse = require('fs-extra');
const appRootPath = require('app-root-path');

/**
 * The editor configuration
 */
export class Config {

    public static indentation = '    ';             // Indentation style
    private static instance: Config;                // Singleton instance of Config

    constructor() {
    }


    /**
     * Singleton pattern
     */
    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }


    /**
     * Returns the editor configuration (just indentation for now)
     */
    setConfig(): Promise<any> {
        return this.setIndentation();
    }


    /**
     * Sets the indentation by default with the .editorconfig file
     */
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
            console.log('WARNING : get indentation from .editorconfig failed. ', e);
            return '    ';
        });
    }
}
