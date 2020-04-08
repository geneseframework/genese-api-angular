/**
 * OpenApi nodes must have a method "init" which is called by the parent node
 *      - source : the object sent by the node parent
 *      - to : the next OpenApi node
 */

export interface InitFactoriesInterface {
	init: (source: object, to?: any) => void;
}
