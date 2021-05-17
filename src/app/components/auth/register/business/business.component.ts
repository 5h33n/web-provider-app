import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Schedule } from 'src/app/models/schedule';

import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  // PROPIEDADES DE DISEÑO
  businessForm!: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  termsAcepted = false;
  marginLeft = "0"
  percent = 0;
  current = 0;
  cover = "block";
  loading = true;
  showing = "none";
  verifier = "none";
  steps = [["General",""],["Ubicación","",],["Contacto",""],["Horarios",""]];
  socialMedia = [["fb",""]];
  schedule = new Schedule()
  notWorkingDays = [false,false,false,false,false,false,false];
  imagePrev: string | undefined = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  charge: string = "none";
// Create a bounding box with sides ~10km away from the center point

  options = {
    componentRestrictions: { country: "us" }
  };

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(private formBuilder: FormBuilder) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit(): void {
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
      phone: [null, [Validators.required,]],
      email: [null, [Validators.required,Validators.pattern(this.emailRegx)]],
      description: [null, [Validators.required]],
      images: [null, [Validators.required]],
      Assessment:[false, Validators.required],
      score:[false, Validators.required],
      Schedule:[this.schedule, Validators.required],
      SocialMedia:[this.socialMedia, Validators.required],
      tags:[false, Validators.required]
    });
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    
    
    //event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  next(e: Event){
    e.preventDefault();
    console.log(this.schedule);
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
  async imagePreview(e:Event){
    const file = (<HTMLInputElement>e.target).files![0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePrev = reader.result?.toString();
    };
  }
}
