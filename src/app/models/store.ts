import {Location} from './location';
import {Schedule} from './schedule';
import {SocialMedia} from './socialMedia';
import {File} from './file';
export class Store{
    id: string;
    idProvider: string;
    name:string;
    photo:string;
    cp:string;
	state:string;
	suburb:string;
	street:string;
	externNumber:string;
	internNumber:string;
    location: Location;
    business:string;
    phone:string;
    email:string;
    description:string;
    nProducts:number;
    images: File[];
    Assessment:string[];
    score:number;
    Schedule:Schedule;
	SocialMedia:SocialMedia[];
	tags:string[];
    createdAt:Date;
    verifiedAt:Date;
    modifiedAt:Date;
    constructor(){
        this.id="";
        this.idProvider="";
        this.name="";
        this.photo="";
        this.cp="";
        this.state="";
        this.suburb="";
        this.street="";
        this.externNumber="";
        this.internNumber="";
        this.location= new Location();
        this.business="";
        this.phone="";
        this.email="";
        this.description="";
        this.nProducts=0;
        this.images= new Array<File>();
        this.Assessment = new Array<string>();
        this.score=0;
        this.Schedule=new Schedule();
        this.SocialMedia = new Array<SocialMedia>();
        this.tags = new Array<string>();
        this.createdAt = new Date();
        this.verifiedAt = new Date();
        this.modifiedAt = new Date();
    }
}