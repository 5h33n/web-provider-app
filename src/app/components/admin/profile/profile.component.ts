import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../common/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentProvider: any | undefined;
  providerForm!: FormGroup;
  contactForm!: FormGroup;
  mobileDevice = false;
  editingGral:boolean = false;
  editingContact:boolean = false;
  constructor(
    private authService:AuthService,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.reorder();
    this.providerForm = this.createProvider(null,null,null,null,null);
    this.contactForm = this.createContact(null,null,null,null);
    this.authService.getProviderById(this.authService.getCurrentUser().id).subscribe((response)=>{
      this.currentProvider = response;
      this.providerForm = this.createProvider(this.currentProvider?.firstName,this.currentProvider?.lastName,this.currentProvider?.secondLastName,new Date(this.currentProvider!.birthdate).toISOString().split('T')[0],this.currentProvider?.gender);
      this.contactForm = this.createContact(this.currentProvider?.username,this.currentProvider?.email,this.currentProvider?.phone,this.currentProvider?.verType)
    });
  }
  createProvider(firstName:string|null,lastName:string|null,secondLastName:string|null,birthdate:string|null,gender:string|null){
    return this.providerForm = this.formBuilder.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      secondLastName: [secondLastName, [Validators.required]],
      birthdate: [birthdate, [Validators.required]],
      gender:[gender,[Validators.required]]
    });
  }
  createContact(username:string|null,email:string|null,phone:string|null,verType:number|null){
    return this.formBuilder.group({
      username: [username, [Validators.required]],
      email: [email, [Validators.required, CustomValidators.emailValid]],
      phone: [phone, [Validators.required, CustomValidators.phoneValid]],
      verType: [verType,[Validators.required]]
    });
  }
  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.reorder();
  }
  reorder(){
    screen.width > 760 ? this.mobileDevice = false : this.mobileDevice = true;
  }
  openImg(){
    (<HTMLInputElement>document.querySelector('#photo-charge')).click();
  }
  editGral(){
    if(this.editingGral){
      Swal.fire({
        title: '¿Descartar los cambios?',
        text: "Si cancelas la edición perderás los campos no guardados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Seguir editando',
        confirmButtonText: 'Descartar cambios'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editingGral = false;
        }
      });
    }else{
      this.editingGral = true;
    }
  }
  editContact(){
    if(this.editingContact){
      Swal.fire({
        title: '¿Descartar los cambios?',
        text: "Si cancelas la edición perderás los campos no guardados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Seguir editando',
        confirmButtonText: 'Descartar cambios'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editingContact = false;
        }
      });
    }else{
      this.editingContact = true;
    }
  }
  save(){
    console.log(this.providerForm);
  }
}
