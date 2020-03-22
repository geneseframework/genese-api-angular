import { Operation } from './operation';
import { Parameter } from './parameter';
import { Reference } from './reference';
import { Server } from './server';

export class PathItem {
	delete?: Operation;
	description?: string;
	get?: Operation;
	head?: Operation;
	options?: Operation;
	parameters?: [Parameter | Reference];
	patch?: Operation;
	post?: Operation;
	put?: Operation;
	$ref?: string;
	servers?: Server[];
	summary?: string;
	trace?: Operation;

}
