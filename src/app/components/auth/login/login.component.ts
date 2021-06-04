import { Component, OnInit } from '@angular/core';
import {trigger,state,style,animate,transition,} from '@angular/animations';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { noSession, infoMessage, redirectMessage } from '../../../common/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations : [
    trigger('circle',[
      state('m',style({width:'70px',height:'70px',backgroundColor:'transparent','border-radius':'50%',opacity:1,top:'50%'})),
      state('m2',style({display:'block',opacity:1,'border-radius': '5px',width: '100%',height: '100%','box-shadow': '0px 15px 20px rgba(0,0,0,0.1)',top:'calc(50% - 225px)',left:'0'})),
      state('p',style({width:'70px',height:'70px',backgroundColor:'transparent','border-radius':'50%',opacity:1,top:'50%','box-shadow':'none'})),
      state('p2',style({display:'block',opacity:1,'border-radius': '5px',width: '380px',height: '450px','box-shadow': '0px 15px 20px rgba(0,0,0,0.1)',top:'calc(50% - 225px)',left:'calc(50% - 190px)'})),
      transition('void => m', [
        style({width:'70px',height:'70px',backgroundColor:'transparent','border-radius':'50%',opacity:1,top:'50%'}),
        animate('0.4s')
      ]),
      transition('m => m2', [
        animate('0.5s')
      ]),
      transition('void =>p',[
        style({width:'70px',height:'70px',backgroundColor:'transparent','border-radius':'50%',opacity:1,top:'50%'}),
        animate('0.4s')
      ]),
      transition('p => p2', [
        animate('0.5s')
      ]),
      transition('p2 => p', [
        animate('0.5s')
      ])
    ]),
    trigger('fadeIn',[
      state('uno', style({
        opacity: 0
      })),
      state('dos', style({
        opacity: 1
      })),
      transition('uno => dos', [
        animate('0.5s')
      ]),
      transition('dos => uno', [
        animate('0.4s')
      ]),
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  
  loading = true;
  showing = true;
  mobile = false;
  cover = "block";
  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    screen.width < 760 ? this.mobile = true : this.mobile = false;
    setTimeout(() => {
      this.loading = false
      this.cover="none";
      setTimeout(() => {
        this.showing = false
       }, 500);
     }, 400);

    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });
  }
  submit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((response)=>{
        console.log(response);
        this.authService.setUser(response.body);
        let currentUser = this.authService.getCurrentUser();
        if(currentUser.verifiedAt){
          //redirecciono a dashboard
          console.log("todavía no estoy programado xd");
        }else{
          this.router.navigate(['verify'],{ queryParams: { r: currentUser.id }});
        }
      },error=>{
        console.log(error);
        let msgError = error.error.notifications ? error.error.notifications[0].descripcion : "No fue posible conectar con el servicio de inicio de sesión, inténtelo de nuevo más tarde";
        infoMessage('error','No se pudo iniciar sesión',msgError,'Aceptar');
      });
    }
  }
  gotoRegister(){
    this.showing = true;
    setTimeout(() => {
      this.loading = true;
      this.cover = "block";
      setTimeout(() => {
        this.router.navigate(['register']);
       }, 500);
     }, 200);
  }
}
