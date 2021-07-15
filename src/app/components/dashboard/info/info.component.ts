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
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  currentBussiness: any | undefined;
  businessForm!: FormGroup;
  //places autocomplete
  options = {
    componentRestrictions: { country: "mx" }
  } as Options;
  //cargando
  gnralLoading:boolean=false;
  locationLoading:boolean=false;
  imagesLoading:boolean=false;
  //control variables
  gnralEditable:boolean | undefined;
  gralErrors:boolean = false;
  locationEditable:boolean | undefined;
  //chips
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tagsSelected: string[] = [];
  defaultTags: string[] = [];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  //imgs
  default_img :string = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  imgLogo: string | undefined = this.default_img;
  imgPortada: string | undefined = this.default_img;
  logoOut : any | undefined=undefined;
  portadaOut :any | undefined=undefined;
  //giros
  myControl = new FormControl();
  giros: string[] = [];
  filteredGiros!: Observable<string[]>;
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
    this.businessService.getStore(this.authService.getCurrentBusiness()!).subscribe((response:any)=>{
      this.currentBussiness = response;
      this.loadGnralInfo();
    });
    this.gnralEditable=false;
    this.selectable=false;
    this.removable=false;
    this.locationEditable=false;
    this.businessService.getGiros().subscribe((giros:any)=>{
      giros.forEach((element: any) => {
        this.giros.push(element.name);
      });
      this.filteredGiros = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter_giros(value))
      );
    });
    this.businessService.getTags(this.myControl.value).subscribe((tags:any)=>{
      this.defaultTags = tags;
      this.filteredTags = this.tagsCtrl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => tag ? this._filter(tag) : this.defaultTags.slice()));
      });
    setTimeout(() => {
      this.tagsCtrl.disable();
      this.myControl.disable();
    });
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
  loadGnralInfo(){
    this.tagsCtrl.setValue(this.currentBussiness.tags);
    this.tagsSelected = this.currentBussiness.tags;
    this.myControl.setValue(this.currentBussiness.business);
    this.businessForm = this.createBusiness(this.currentBussiness.name,this.currentBussiness.cp,this.currentBussiness.state,this.currentBussiness.suburb,this.currentBussiness.street,this.currentBussiness.externNumber,this.currentBussiness.internNumber,this.currentBussiness.business,this.currentBussiness.phone,this.currentBussiness.email,this.currentBussiness.description,this.currentBussiness.schedule,this.currentBussiness.socialMedia,this.currentBussiness.tags,this.currentBussiness.location.coordinates[0],this.currentBussiness.location.coordinates[1]);
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
  private _filter_giros(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.giros.filter(option => option.toLowerCase().includes(filterValue));
  }
  async imagePreview(e:Event,target:number){
    const file = (<HTMLInputElement>e.target).files![0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (target==0){
        this.imgLogo = reader.result?.toString();
        this.logoOut = {
          name: `logo_${this.authService.getCurrentUser().id}_${file.lastModified}`,
          type:"logo",
          weight:file.size,
          description:null,
          data:reader.result?.toString(),
          extension:file.name.split('.').pop()
        }
      }else if (target==1){
        this.imgPortada = reader.result?.toString();
        this.portadaOut = {
          name: `cover_${this.authService.getCurrentUser().id}_${file.lastModified}`,
          type:"cover",
          weight:file.size,
          description:null,
          data:reader.result?.toString(),
          extension:file.name.split('.').pop()
        }
      }
    };
  }
  //EDICIÓN GENERAL
  gnralEdit(){
    this.gnralEditable=true;
    this.selectable=true;
    this.removable=true;
    this.tagsCtrl.enable();
    this.myControl.enable();
  }
  gnralSave(){

  }
  gnralCancel(){
    this.gnralEditable=false;
    this.selectable=false;
    this.removable=false;
    this.tagsCtrl.disable();
    this.myControl.disable();
    this.loadGnralInfo();
  }
  changeDireccion(e:Address){
    //aqui meter un gif de carga
    let addr: { [key: string]: any } = {};
    e.address_components.forEach(element => {
      addr[element.types[0]] = element.long_name;
    });
    this.businessForm.patchValue({cp:addr["postal_code"]});
    this.businessForm.patchValue({state:addr["administrative_area_level_1"]});
    this.businessForm.patchValue({suburb:addr["locality"]});
    this.businessForm.patchValue({street:addr["route"]});
    this.businessForm.patchValue({externNumber:addr["street_number"]});
    this.businessForm.patchValue({lt:e.geometry.location.lat()});
    this.businessForm.patchValue({ln:e.geometry.location.lng()});
  }
}
