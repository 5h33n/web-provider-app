import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Schedule } from 'src/app/models/schedule';

import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { AuthService } from 'src/app/services/auth.service';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import {trigger,state,style,animate,transition,} from '@angular/animations';
import { CustomValidators } from '../../../../common/common';
import { noSession, infoMessage, redirectMessage } from '../../../../common/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
  animations : [
    trigger('show',[
      transition('def => m', [
        style({opacity:0}),
        animate('0.5s',style({opacity:1}))
      ]),
    ])
  ]
})
export class BusinessComponent implements OnInit {
  // PROPIEDADES DE DISEÑO
  businessForm!: FormGroup;

  //animation
  cover = "block";
  loading = true;
  showing = "none";
  termsAcepted = false;
  marginLeft = "0"
  percent = 0;
  current = 0;

  verifier = "none";
  steps = [["General",""],["Ubicación","",],["Contacto",""],["Horarios",""]];
  socialMedia = [["fb",""]];
  schedule = new Schedule()
  notWorkingDays = [false,false,false,false,false,false,false];
  default_img :string = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  imgLogo: string | undefined = this.default_img;
  imgPortada: string | undefined = this.default_img;
  logoOut : any | undefined=undefined;
  portadaOut :any | undefined=undefined;
  charge: boolean = false;
// Create a bounding box with sides ~10km away from the center point

  options = {
    componentRestrictions: { country: "mx" }
  } as Options;

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tagsSelected: string[] = ['Abarrotes'];
  defaultTags: string[] = ['Frutas', 'verduras', 'Leche', 'Huevos', 'Condimentos'];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService, 
    private authService:AuthService,
    private router:Router,
    ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.defaultTags.slice()));
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.cover="none";
      this.loading = false;
      this.showing = "block"
     }, 1000);
    this.businessForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      photo: ["zxc", [Validators.required]],
      cp: [null, [Validators.required]],
      state: [null, [Validators.required]],
      suburb: [null, [Validators.required]],
      street: [null, [Validators.required]],
      externNumber: [null, [Validators.required]],
      internNumber: [null, [Validators.required]],
      business: [null, [Validators.required]],
      phone: [null, [Validators.required,CustomValidators.phoneValid]],
      email: [null, [Validators.required,CustomValidators.emailValid]],
      description: [null, [Validators.required]],
      images: [null, [Validators.required]],
      Assessment:[false, Validators.required],
      score:[false, Validators.required],
      Schedule:[this.schedule, Validators.required],
      SocialMedia:[this.socialMedia, Validators.required],
      tags:[null, Validators.required],
      lt:[null, Validators.required],
      ln:[null, Validators.required]
    });
  }
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
  next(e: Event){
    e.preventDefault();
    this.percent += 25;
    this.marginLeft = `-${this.percent}%`;
    this.steps[this.current][1] = "active";
    this.current+=1;
  }
  prev(e: Event){
    e.preventDefault();
    this.percent -= 25;
    this.marginLeft = `-${this.percent}%`;
    this.current-=1;
    this.steps[this.current][1] = "";
  }
  setSocialMediaValue(i: number,t:number,e:Event){
    this.socialMedia[i][t]=(<HTMLInputElement>e.target).value
  }
  addSocialMedia(e: Event){
    this.socialMedia.push(["fb",""]);
    this.businessForm.controls["SocialMedia"].setValue(this.socialMedia);
  }
  setSchedule(day: number,pos:number,e:Event){
    let _time_ = (<HTMLInputElement>e.target).value;
    let _date_time_ = `December 17, 1995 ${_time_}:00`;
    let formed_time = new Date(_date_time_);
    switch(day){
      case 0:
        (pos==0) ? this.schedule.monday.setStart(formed_time) : this.schedule.monday.setEnd(formed_time);
        break;
      case 1:
        (pos==0) ? this.schedule.saturday.setStart(formed_time) : this.schedule.saturday.setEnd(formed_time);
        break;
      case 2:
        (pos==0) ? this.schedule.wednesday.setStart(formed_time) : this.schedule.wednesday.setEnd(formed_time);
       break;
      case 3:
        (pos==0) ? this.schedule.thursday.setStart(formed_time) : this.schedule.thursday.setEnd(formed_time);
        break;
      case 4:
        (pos==0) ? this.schedule.friday.setStart(formed_time) : this.schedule.friday.setEnd(formed_time);
        break;
      case 5:
        (pos==0) ? this.schedule.sunday.setStart(formed_time) : this.schedule.sunday.setEnd(formed_time);
        break;
      case 6:
        (pos==0) ? this.schedule.saturday.setStart(formed_time) : this.schedule.saturday.setEnd(formed_time);
        break;
    }
  }
  notWork(day:number,e:Event){
    if((<HTMLInputElement>e.target).checked){
      this.notWorkingDays[day] = true;
      switch(day){
        case 0:
          this.schedule.monday.setStart(undefined);
          this.schedule.monday.setEnd(undefined);
          break;
        case 1:
          this.schedule.saturday.setStart(undefined);
          this.schedule.saturday.setEnd(undefined);
          break;
        case 2:
          this.schedule.wednesday.setStart(undefined);
          this.schedule.wednesday.setEnd(undefined);
        break;
        case 3:
          this.schedule.thursday.setStart(undefined);
          this.schedule.thursday.setEnd(undefined);
          break;
        case 4:
          this.schedule.friday.setStart(undefined);
          this.schedule.friday.setEnd(undefined);
          break;
        case 5:
          this.schedule.sunday.setStart(undefined);
          this.schedule.sunday.setEnd(undefined);
          break;
        case 6:
          this.schedule.saturday.setStart(undefined);
          this.schedule.saturday.setEnd(undefined);
          break;
      }
    }else{
      this.notWorkingDays[day] = false;
    }
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
  createBusiness(){
    let smedia:any[] = [];
    if (this.socialMedia[0][1] != ""){
      this.socialMedia.forEach(element => {
        smedia.push({[element[0]]:element[1]});
      });
    }
    let imgs:any[] = [];
    if (this.portadaOut != undefined || this.logoOut != undefined){
      this.logoOut != undefined ? imgs.push(this.logoOut) : "";
      this.portadaOut != undefined ? imgs.push(this.portadaOut) : "";
    }
    let businessObj: any = {
      idProvider: this.authService.getCurrentUser().id,
      name : this.businessForm.value.name,
      cp : this.businessForm.value.cp,
      state : this.businessForm.value.state,
      suburb : this.businessForm.value.suburb,
      street : this.businessForm.value.street,
      externNumber : this.businessForm.value.externNumber,
      internNumber : this.businessForm.value.internNumber,
      business : this.businessForm.value.business,
      phone : this.businessForm.value.phone,
      email : this.businessForm.value.email,
      description : this.businessForm.value.description,
      lt: this.businessForm.value.lt,
      ln: this.businessForm.value.ln,
      tags: this.tagsSelected,
      images: imgs.length==0 ? null : imgs,
      schedule: this.businessForm.value.Schedule.empty() ? null : this.businessForm.value.Schedule,
      socialMedia: smedia.length==0 ? null : smedia
    };
    //ADVERTENCIA: LA CONSOLA SE TRABA SI IMPRIMO EL OBJETO CON IMAGENES
    this.charge=true;
    this.businessService.createStore(businessObj).subscribe(store=>{
      if(store){
        this.router.navigate(['dashboard']);
      }
    },error => {
      //Aquí falta redirigir a donde está el error
      let msgError = error.error.notifications ? error.error.notifications[0].descripcion : "No fue posible conectar con el servicio de registro, inténtelo de nuevo más tarde";
      infoMessage('error','No se pudo crear el negocio',msgError,'Aceptar');
    });
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
