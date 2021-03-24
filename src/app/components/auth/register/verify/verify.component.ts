import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router:Router,
    private formBuilder: FormBuilder
  ) { }
  currentProvider = new Provider()

  verifyForm!: FormGroup;
  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      d1: [null, [Validators.required]],
      d2: [null, [Validators.required]],
      d3: [null, [Validators.required]],
      d4: [null, [Validators.required]],
      d5: [null, [Validators.required]],
      d6: [null, [Validators.required]]
    });
    this.currentProvider = this.authService.getCurrentUser();
    console.log(this.currentProvider);
    this.route.queryParams
      .subscribe(params => {
        if(!params.vux || !this.currentProvider){
          this.redirectLogin(params);
        }else if(params.tkn){
          this.verifyTkn(params.vux,params.tkn);
        }
      });
  }

  redirectLogin(params:any){
    Swal.fire(
      'Enlace inválido',
      'No tienes permitido entrar aquí, intenta iniciar sesión primero',
      'error'
    ).then((result) => {
      this.router.navigate(['login'],{ queryParams: params });
    });
  }

  verifyTkn(user:string,tkn:string){
    var info = {id:user,token:tkn,codigo:null};
    this.authService.accountConfirm(info).subscribe(response=>{
      console.log(response)
      if(response){
        if(response.codigo==="0000000033"){
          Swal.fire({
            icon: 'success',
            title: 'Correo verificado',
            text: '¡Bien! ¡Tu cuenta ha sido verificada exitosamente!',
            confirmButtonText: 'Continuar',
          }).then((result) => {
            if (result.value) {
              console.log("Continuamos");
              //this.router.navigate(['/dashboard']);
            }
          })
        }
      }else{
        this.showError("Error en la verificación");
      }
    },error=>{
      this.showError(error.error.notifications[0].descripcion);
    });
  }

  showError(error:string){
    Swal.fire({
      icon: 'error',
      title: 'Error en la verificación',
      text: error,
      confirmButtonText: 'Volver al dashboard',
    }).then((result) => {
      if (result.value) {
        console.log("Aquí hay que hacer algo");
      }
    })
  }

  changeVerType(){
    Swal.fire({
      input: 'select',
      title: 'Selecciona un médio de verificación',
      text: '¿Cómo quieres verificar tu cuenta?',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      inputOptions: {
        1:"Verificar usando mi correo",
        2:"Verificar usando mi número de teléfono"
      },
    }).then((result:any) => {
      if (result.value) {
        if (result.value==1){
          Swal.fire({
            input: 'email',
            title: 'Ingresa tu correo electrónico para verificiación',
            text: 'Asegurate de tener acceso, te enviaremos tu código a este correo',
            confirmButtonText: 'Siguiente &rarr;',
            showCancelButton: true,
          }).then((dato:any) => {
            if(dato){
              console.log(result.value)
              console.log(dato.value)
            }
          })
        }else{
          Swal.fire({
            input: 'text',
            title: 'Ingresa tu número de telefono para verificiación',
            text: 'Asegurate de tener acceso, te enviaremos tu código a este número por SMS',
            confirmButtonText: 'Siguiente &rarr;',
            showCancelButton: true,
            inputValidator: (v) => {
              return new Promise((resolve,reject) => {
                if (v === '1') {
                  resolve('Ingresa un número telefónico válido de 10 dígitos')
                } else {
                  resolve('')
                }
              })
            }
          }).then((dato:any) => {
            if(dato){
              console.log(result.value)
              console.log(dato.value)
            }
          })
        }
      }
    })
  }
  resendCode(){
    let dest = this.currentProvider.verType == 1 ? this.currentProvider.email : this.currentProvider.phone;
    Swal.fire({
      icon: 'success',
      title: 'Código reenviado',
      text: 'Se ha enviado tu código de verificación a: '+dest,
      confirmButtonText: '¡De acuerdo!',
    })
  }
}