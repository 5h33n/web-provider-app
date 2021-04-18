export class Provider {
    id: string;
    username: string;
    photo: string;
    password: string;
    firstName: string;
    lastName: string;
    secondLastName: string;
    birthdate: Date;
    gender: string;
    email: string;
    phone: string;
    type: string;
    Documents?: string;
    verType: number;
    verifiedAt?: Date;
    createdAt: Date;
    modifiedAt: Date;
    constructor(){
        this.id = "";
        this.username = "";
        this.photo = "";
        this.password = "";
        this.firstName = "";
        this.lastName = "";
        this.secondLastName = "";
        this.birthdate = new Date();
        this.gender = "";
        this.email = "";
        this.phone = "";
        this.type = "";
        this.Documents = undefined;
        this.verType = 0;
        this.verifiedAt = undefined;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }
  }
  