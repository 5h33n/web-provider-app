import { Component, OnInit } from '@angular/core';
import {trigger,state,style,animate,transition,} from '@angular/animations';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Provider } from 'src/app/models/provider';
import Swal from 'sweetalert2';
import { noSession, infoMessage, redirectMessage } from '../../../common/common'
import { ProviderService } from 'src/app/services/provider.service';
class CustomValidators{
  static emailValid(control: AbstractControl): ValidationErrors{
    const regex = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    if (regex.test(control.value) && control.value !== null){
      return {};
    }else{
      return {emailInvalid: true};
    }
  }
  static strongPassword(control: AbstractControl): ValidationErrors{
    const regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    if (regex.test(control.value) && control.value !== null){
      return {};
    }else{
      return {passwordInvalid: true};
    }
  }
  static passwordsMatch (control: AbstractControl): ValidationErrors {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    if((password === passwordConfirm) && (password !== null && passwordConfirm !== null)) {
      return {};
    } else {
      return {passwordsNotMatching: true};
    }
  }
  static phoneValid(control: AbstractControl): ValidationErrors{
    const regex = /^\(?(\d{10})\)?$/;
    if (regex.test(control.value) && control.value !== null){
      return {};
    }else{
      return {phoneInvalid: true};
    }
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations : [
    trigger('show',[
      transition('def => m', [
        style({opacity:0}),
        animate('0.5s',style({opacity:1}))
      ]),
    ])
  ]
})
export class RegisterComponent implements OnInit {
  // Dise??o
  registerForm!: FormGroup;
  termsAcepted = false;
  
  //Datos
  newUser: Provider = new Provider();
  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private providerService: ProviderService
    ) { }
  // PROPIEDADES DE DISE??O
  marginLeft = "0"
  percent = 0;
  current = 0;
  cover = "block";
  loading = true;
  showing = "none";
  verifier = "none";
  steps = [["Cuenta",""],["Usuario","",],["Contacto",""],["Negocio",""]];

  ngOnInit(): void {
    //ANIMACIONES
    setTimeout(() => {
      this.cover="none";
      this.loading = false;
      this.showing = "block"
     }, 1000);
     //FORMULARIO
     this.registerForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      photo: ["zxc", [Validators.required]],
      password: [null, [Validators.required, CustomValidators.strongPassword]],
      passwordConfirm: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      secondLastName: [null, [Validators.required]],
      birthdate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.emailValid]],
      phone: [null, [Validators.required, CustomValidators.phoneValid]],
      verType: [null, [Validators.required]],
      type: [null, [Validators.required]],
      terms:[false, Validators.required]
    },{
      validators: CustomValidators.passwordsMatch
    });
  }
  showInfoPassword(){
    infoMessage('warning','Ingresa una contrase??a segura','La contrase??a debe tener entre 8 y 16 caract??res, contener al menos una letra may??scula, una letra min??scula y un n??mero','Aceptar');
  }
  setType(tipo:string,text:string){
    Swal.fire({
      title: '??Est??s seguro?',
      text: "??Quieres crear un negocio para promocionar "+text+"? Toma en cuenta que no podr??s cambiar esto despu??s",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '??S??, hag??moslo!'
    }).then((result) => {
      if (result.isConfirmed) {
        //Aqu?? estoy seguro que todo ya est?? validado
        this.registerForm.controls['type'].setValue(tipo);
        this.register();
      }
    })
  }
  next(e: Event){
    e.preventDefault();
    this.percent += 25;
    this.marginLeft = `-${this.percent}%`;
    this.steps[this.current][1] = "active";
    this.current+=1;
  }
  prev(e: Event | null){
    e ? e.preventDefault() : "";
    this.percent -= 25;
    this.marginLeft = `-${this.percent}%`;
    this.current-=1;
    this.steps[this.current][1] = "";
  }
  register(){
    if (this.registerForm.invalid){
      infoMessage('error','Imposible registrar usuario','Algunos datos proporcionados son inv??lidos','Aceptar');
    }else{
      this.newUser.username = this.registerForm.value.username;
      this.newUser.password = this.registerForm.value.password;

      this.newUser.firstName = this.registerForm.value.firstName;
      this.newUser.lastName = this.registerForm.value.lastName;
      this.newUser.secondLastName = this.registerForm.value.secondLastName;
      this.newUser.birthdate = new Date(this.registerForm.value.birthdate);
      this.newUser.gender = this.registerForm.value.gender;

      this.newUser.email = this.registerForm.value.email;
      this.newUser.phone = "+52"+this.registerForm.value.phone;
      this.newUser.verType = this.registerForm.value.verType === "Correo electr??nico" ? 1 : 2 ;

      this.newUser.type = this.registerForm.value.type;
      this.newUser.Documents = undefined;

      this.newUser.verifiedAt = undefined;
      this.newUser.createdAt = new Date();
      this.newUser.modifiedAt = new Date();
      this.newUser.photo = "";
      this.providerService.registerUser(this.newUser).subscribe(provider=>{
        this.authService.refreshSession().subscribe((response)=>{
            this.authService.setUser(response);
        });
        setTimeout(() => {
          this.showing = "none";
          this.verifier = "block";
          //Aqu?? mando a verificar pero con el id del usuario
          this.router.navigate(['verify'],{ queryParams: { r: provider.id }});
        }, 3000); 
      },error => {
        //Aqu?? falta redirigir a donde est?? el error
        let msgError = error.error.notifications ? error.error.notifications[0].descripcion : "No fue posible conectar con el servicio de registro, int??ntelo de nuevo m??s tarde";
        this.registerForm.controls['type'].setValue(null);
        infoMessage('error','No se pudo crear la cuenta',msgError,'Aceptar');
        this.prev(null);
      });
    }
  }
}
