import { Component, ElementRef, OnInit, QueryList, ViewChildren, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {trigger,state,style,animate,transition,} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { noSession, infoMessage, redirectMessage, Logout } from '../../../../common/common'
import { ProviderService } from 'src/app/services/provider.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  animations : [
    trigger('show',[
      transition('def => m', [
        style({opacity:0}),
        animate('0.5s',style({opacity:1}))
      ]),
    ])
  ]
})
export class VerifyComponent implements OnInit {
  //animation
  cover = "block";
  loading = true;
  showing = "none";

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  del = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private providerService: ProviderService,
    private router:Router,
    private formBuilder: FormBuilder
  ) { }
  currentProvider = new Provider()
  verifyForm!: FormGroup;
  emailRegex = /^\(?(\d{10})\)?$/;
  ngOnInit(): void {
    setTimeout(() => {
      this.cover="none";
      this.loading = false;
      this.showing = "block"
     }, 1000);
    this.verifyForm = this.formBuilder.group({
      d1: [null, [Validators.required]],
      d2: [null, [Validators.required]],
      d3: [null, [Validators.required]],
      d4: [null, [Validators.required]],
      d5: [null, [Validators.required]],
      d6: [null, [Validators.required]]
    });
    this.currentProvider = this.authService.getCurrentUser();
    console.log(this.currentProvider)
    this.route.queryParams
      .subscribe(params => {
        if(!params.r && !this.currentProvider){
          this.redirectLogin(params);
        }else if(params.tok){
          this.verifyTkn(params.r,params.tok);
        }else if(this.currentProvider.id != params.r){
          redirectMessage('warning','No se encontró el usuario','El enlace ingresado corresponde a la verificación de un usuario desconocido ¿Estás accediendo correctamente al enlace?',"De acuerdo, lo revisaré",this.router,'/login')
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

  verifyTkn(user:string,tok:string){
    var info = {id:user,token:tok,codigo:null};
    this.verify(info);
  }
  verifyCode(){
    var code = "";
    for (var i in this.inputs.toArray())
      code += this.inputs.toArray()[i].nativeElement.value;
    var info = {id:this.currentProvider.id,token:null,codigo:code};
    this.verify(info);
  }
  verify(info:any){
    console.log("verificando...");
    this.authService.accountConfirm(info).subscribe(response=>{
      if(response){
        if(response.codigo==="0000000033"){
          Swal.fire({
            icon: 'success',
            title: 'Correo verificado',
            text: '¡Bien! ¡Tu cuenta ha sido verificada exitosamente!',
            confirmButtonText: 'Continuar',
          }).then((result) => {
            if (result.value) {
              this.authService.refreshSession().subscribe((response)=>{
                this.authService.setUser(response);
                this.router.navigate(['business'],{ queryParams: { r: this.currentProvider.id }});
              });
            }
          })
        }else{
          infoMessage('error','Error en la verificación',response.descripcion + ". Recuerde que los enlaces de verificación solo están disponibles durante 1 hora desde que son enviados, intente reenviar el código de verificación.",'ok');
          this.verifyForm.reset();
        }
      }else{
        redirectMessage('error','Error en la verificación','No pudimos verificar tu cuenta, intenta reenviar el código','ok',this.router,'/login');
      }
    },error=>{
      redirectMessage('error','Error en la verificación',error.error.notifications[0].descripcion,'ok',this.router,'/login');
    });
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
            inputValue:this.currentProvider.email,
            confirmButtonText: 'Siguiente &rarr;',
            showCancelButton: true,
          }).then((dato:any) => {
            if(dato){
              this.providerService.updateUserContact({id:this.currentProvider.id,email:dato.value,verType:result.value}).subscribe((provider)=>{
                if(provider){
                  this.currentProvider.verType = result.value;
                  this.currentProvider.email = dato.value;
                  this.authService.refreshSession().subscribe((response)=>{
                      this.authService.setUser(response);
                  });
                  this.resendCode('Información actualizada','En breve recibirás un correo con tu código de verificación');
                }else{
                  throw Error("unkown");
                }
              },error=>{
                error.error.notifications ? infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok') : infoMessage('error','Imposible actualizar la información','Ocurrió un error desconocido','ok');
              });
            }
          })
        }else{
          Swal.fire({
            input: 'text',
            title: 'Ingresa tu número de telefono para verificiación',
            text: 'Asegurate de tener acceso, te enviaremos tu código a este número por SMS',
            confirmButtonText: 'Siguiente &rarr;',
            inputValue:this.currentProvider.phone.substr(3),
            showCancelButton: true,
            inputValidator: (v) => {
              return new Promise((resolve,reject) => {
                if (!this.emailRegex.test(v)) {
                  resolve('Ingresa un número telefónico válido de 10 dígitos')
                } else {
                  resolve('')
                }
              })
            }
          }).then((dato:any) => {
            if(dato){
              this.providerService.updateUserContact({id:this.currentProvider.id,phone:dato.value,verType:result.value}).subscribe((provider)=>{
                if(provider){
                  this.currentProvider.verType = result.value;
                  this.currentProvider.phone = dato.value;
                  this.authService.refreshSession().subscribe((response)=>{
                      this.authService.setUser(response);
                  });
                  this.resendCode('Información actualizada','En breve recibirás un SMS con tu código de verificación');
                }else{
                  throw Error("unkown");
                }
              },error=>{
                error.error.notifications ? infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok') : infoMessage('error','Imposible actualizar la información','Ocurrió un error desconocido','ok');
              });
            }
          })
        }
      }
    })
  }
  resendCode(msg:string,head:string|null){
    this.authService.resendCode(this.currentProvider.id).subscribe((response:any)=>{
      infoMessage('success',head?head:'Código reenviado',msg ? msg : response?.description,'¡De acuerdo!');
    },error=>{
      error.error.notifications[0].codigo == "0000000006" ? noSession(this.router) : infoMessage('error','Algo salió mal',error.error.notifications[0].descripcion,'¡De acuerdo!') ;
    });
  }
  getNumber(e:any, n:number){
    this.del = false;
    if (e.key.charCodeAt(0) == 66 || e.key.charCodeAt(0) == 68 ){
      this.inputs.toArray()[n] = e.key;
      this.del = true;
    }else if((e.key.charCodeAt(0) < 48 || e.key.charCodeAt(0) > 57)){
      this.del = false;
      e.preventDefault();
    }
  }
  next(n:number){
    if(n<5 && !this.del){
      this.inputs.toArray()[n].nativeElement.value==="" ? "" : this.inputs.toArray()[n+1].nativeElement.focus();
    }else if(this.del){
      n>0 ? this.inputs.toArray()[n-1].nativeElement.focus() : "";
    }
  }
  prev(n:number){
    if(n>0){
      if(this.inputs.toArray()[n-1].nativeElement.value === ""){
        this.inputs.toArray()[n-1].nativeElement.focus();
        this.prev(n-1);
      }
    }
  }
  logout(){
    Logout(this.authService,this.router);
  }
}