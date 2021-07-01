import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { CustomValidators } from '../../../common/common';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  currentBussiness: any | undefined;
  businessForm!: FormGroup;
  //control variables
  gnralEditable:boolean | undefined;
  gralErrors:boolean = false;
  //chips
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tagsSelected: string[] = ['Abarrotes'];
  defaultTags: string[] = ['Frutas', 'verduras', 'Leche', 'Huevos', 'Condimentos'];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  //imgs
  default_img :string = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  imgLogo: string | undefined = this.default_img;
  imgPortada: string | undefined = this.default_img;
  constructor(
    private authService:AuthService,
    private businessService:BusinessService,
    private formBuilder: FormBuilder
    ) { 
      this.filteredTags = this.tagsCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => tag ? this._filter(tag) : this.defaultTags.slice()));
    }

  ngOnInit(): void {
    this.businessForm = this.createBusiness(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    this.businessService.getStore(this.authService.getCurrentBusiness()!).subscribe((response)=>{
      this.currentBussiness = response;
      this.businessForm = this.createBusiness(this.currentBussiness.name,this.currentBussiness.cp,this.currentBussiness.state,this.currentBussiness.suburb,this.currentBussiness.street,this.currentBussiness.externNumber,this.currentBussiness.internNumber,this.currentBussiness.business,this.currentBussiness.phone,this.currentBussiness.email,this.currentBussiness.description,this.currentBussiness.schedule,this.currentBussiness.socialMedia,this.currentBussiness.tags,this.currentBussiness.location.coordinates[0],this.currentBussiness.location.coordinates[1]);
    });
    this.gnralEditable=false;
    this.selectable=false;
    this.removable=false;
    setTimeout(() => this.tagsCtrl.disable());
  }
  createBusiness(name:string|null,cp:string|null,state:string|null,suburb:string|null,street:string|null,externNumber:string|null,internNumber:string|null,business:string|null,phone:string|null,email:string|null,description:string|null,schedule:any|null,socialMedia:any|null,tags:string[]|null,lt:string|null,ln:string|null){
    return this.formBuilder.group({
      name: [name, [Validators.required]],
      cp: [cp, [Validators.required]],
      state: [state, [Validators.required]],
      suburb: [suburb, [Validators.required]],
      street: [street, [Validators.required]],
      externNumber: [externNumber, [Validators.required]],
      internNumber: [internNumber, [Validators.required]],
      business: [business, [Validators.required]],
      phone: [phone, [Validators.required,CustomValidators.phoneValid]],
      email: [email, [Validators.required,CustomValidators.emailValid]],
      description: [description, [Validators.required]],
      Schedule:[schedule, Validators.required],
      SocialMedia:[socialMedia, Validators.required],
      tags:[tags, Validators.required],
      lt:[lt, Validators.required],
      ln:[ln, Validators.required]
    });
  }
  //chips
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagsSelected.push(value);
    }
    event.input.value = '';
    this.tagsCtrl.setValue(null);
  }
  remove(tag: string): void {
    const index = this.tagsSelected.indexOf(tag);
    if (index >= 0) {
      this.tagsSelected.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagsSelected.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.defaultTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }
  async imagePreview(e:Event,target:number){
    const file = (<HTMLInputElement>e.target).files![0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
  }
  //EDICIÓN GENERAL
  gnralEdit(){
    this.gnralEditable=true;
    this.selectable=true;
    this.removable=true;
    this.tagsCtrl.enable();
  }
  gnralSave(){

  }
  gnralCancel(){
    this.gnralEditable=false;
    this.selectable=false;
    this.removable=false;
    this.tagsCtrl.disable();
  }

}
