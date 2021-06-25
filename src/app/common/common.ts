import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
export function noSession(router: Router){
    Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: "Tu sesión ha expirado, por favor inicia sesión para continuar",
        confirmButtonText: '¡De acuerdo!',
      }).then((result) => {
        if (result.value) {
            router.navigate(['/login']);
        }
      })
}
export function infoMessage(i:any,t:string,tx:string,confirm:string){
    Swal.fire({
        icon: i,
        title: t,
        text: tx,
        confirmButtonText: confirm,
      })
}
export function redirectMessage(i:any,t:string,tx:string,confirm:string,router:Router, route:string){
    Swal.fire({
        icon: i,
        title: t,
        text: tx,
        confirmButtonText: confirm,
      }).then((result)=>{
          if(result.value){
              router.navigate([route]);
          }
      });
}
export class CustomValidators{
    public static emailValid(control: AbstractControl): ValidationErrors{
      const regex = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
      if (regex.test(control.value) && control.value !== null){
        return {};
      }else{
        return {emailInvalid: true};
      }
    }
    public static strongPassword(control: AbstractControl): ValidationErrors{
      const regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
      if (regex.test(control.value) && control.value !== null){
        return {};
      }else{
        return {passwordInvalid: true};
      }
    }
    public static passwordsMatch (control: AbstractControl): ValidationErrors {
      const password = control.get('password')?.value;
      const passwordConfirm = control.get('passwordConfirm')?.value;
      if((password === passwordConfirm) && (password !== null && passwordConfirm !== null)) {
        return {};
      } else {
        return {passwordsNotMatching: true};
      }
    }
    public static phoneValid(control: AbstractControl): ValidationErrors{
      const regex = /^\(?(\d{10})\)?$/;
      if (regex.test(control.value) && control.value !== null){
        return {};
      }else{
        return {phoneInvalid: true};
      }
    }
}
export function Logout(authService : AuthService, router: Router){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Seguro que quieres cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, quiero salir'
    }).then((result) => {
      if (result.isConfirmed) {
        authService.logout().subscribe((response)=>{
          authService.removeLocalUser();
          router.navigate(["login"]);
        });
      }
    });
  }
  export function LogoutForce(authService : AuthService, router: Router){
      authService.logout().subscribe((response)=>{
        authService.removeLocalUser();
        router.navigate(["login"]);
      });
  }