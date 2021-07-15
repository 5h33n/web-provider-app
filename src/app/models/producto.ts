import {Location} from './location';
export class Producto {
    id:string | undefined;
    idStore:string | undefined;
	name:string | undefined;
	description:string | undefined;
	price:number | undefined;
	photo:string | undefined;
	stock:number | undefined;
	unit:string | undefined;
	state:number | undefined;
	images:string | undefined;
	createdAt:Date | undefined;
	modifiedAt:Date | undefined;
	Assessment:string[] | undefined;
	score:number | undefined;
	tags:string[] | undefined;
	location:Location | undefined;
  }