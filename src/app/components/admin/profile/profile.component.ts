import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import { ProviderService } from 'src/app/services/provider.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CustomValidators, infoMessage, LogoutForce } from '../../../common/common';
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
    private providerService:ProviderService,
    private formBuilder: FormBuilder,
    private router:Router
  ) { }
  ngOnInit(): void {
    this.reorder();
    this.providerForm = this.createProvider(null,null,null,null,null);
    this.contactForm = this.createContact(null,null,null,null);
    this.providerService.getProviderById(this.authService.getCurrentUser().id).subscribe((response)=>{
      this.currentProvider = response;
      this.loadGral();
      this.loadContact();
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
  loadGral(){
    this.providerForm = this.createProvider(this.currentProvider?.firstName,this.currentProvider?.lastName,this.currentProvider?.secondLastName,new Date(this.currentProvider!.birthdate).toISOString().split('T')[0],this.currentProvider?.gender);
  }
  createContact(username:string|null,email:string|null,phone:string|null,verType:number|null){
    return this.formBuilder.group({
      username: [username, [Validators.required]],
      email: [email, [Validators.required, CustomValidators.emailValid]],
      phone: [phone, [Validators.required, CustomValidators.phoneValid]],
      verType: [verType,[Validators.required]]
    });
  }
  loadContact(){
    this.contactForm = this.createContact(this.currentProvider?.username,this.currentProvider?.email,this.currentProvider?.phone,this.currentProvider?.verType)
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
  upPhoto(e:Event){
    const newPhoto = (<HTMLInputElement>e.target).files![0];
    console.log(newPhoto);
    const reader = new FileReader();
    reader.readAsDataURL(newPhoto);
    reader.onload = () => {
      const fileObj = {
        name:`profile_${this.authService.getCurrentUser().id}_${newPhoto.lastModified}`,
        type:"profile",
        weight:newPhoto.size,
        description:"Foto de perfil proveedor",
        data:reader.result?.toString(),
        extension:newPhoto.name.split('.').pop()
      }
      this.providerService.updatePhoto(fileObj).subscribe((resp)=>{
        console.log(resp)
      });
    }
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
      this.loadGral();
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
      this.loadContact();
    }
  }
  saveGral(){
    Swal.fire({
      title: 'Confirmar',
      text: "¿Desea guardar estos cambios?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        const providerObj = {
          id: this.currentProvider.id,
          firstName: this.providerForm.value.firstName,
          lastName: this.providerForm.value.lastName,
          secondLastName: this.providerForm.value.secondLastName,
          birthdate: new Date(this.providerForm.value.birthdate),
          gender: this.providerForm.value.gender
        };
        this.providerService.updateUserInfo(providerObj).subscribe((r)=>{
          if (r){
            this.authService.refreshSession().subscribe((response)=>{
              this.authService.setUser(response);
              infoMessage('success','Listo','Información actualizada correctamente','¡De acuerdo!');
              this.editingGral = false;
              this.ngOnInit();
            });
          }else{
            infoMessage('error','Algo salió mal','No fue posible editar la informacion, intentalo de nuevo más tarde','ok');
          }
        },error=>{
          infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok');
        });
      }
    });
  }
  saveContact(){
    const reVer:boolean = this.currentProvider.verType != this.contactForm.value.verType ? true : this.currentProvider.verType == 1 && (this.currentProvider.email != this.contactForm.value.email) ? true : this.currentProvider.verType == 2 && (this.currentProvider.phone != this.contactForm.value.phone) ? true : false;
    const txt:string = reVer ? "Estás modificando alguno de los datos con los que tu cuenta está verificada, este cambio cerrará tu sesión y no podrás acceder hasta verificar tu cuenta de nuevo ¿Estás seguro de continuar? " : "Se actualizará tu información de contacto";
    const tit:string = reVer ? "ADVERTENCIA" : "¿Deseas continuar?";
    const icon:SweetAlertIcon = reVer ? 'error':'warning';
    Swal.fire({
      title: tit,
      text: txt,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        const providerObj = {
          id: this.currentProvider.id,
          username: this.contactForm.value.username,
          email: this.contactForm.value.email,
          phone: this.contactForm.value.phone,
          verType: this.contactForm.value.verType
        }
        if (reVer){
          Swal.fire({
            title: 'Ingresa tu contraseña para continuar',
            input: 'password',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            showLoaderOnConfirm: true,
            preConfirm: (pwd) => {
              return this.authService.login({username:this.currentProvider.username,password:pwd}).subscribe((response)=>{
                this.providerService.updateUserContact(providerObj).subscribe((r)=>{
                  console.log(r);
                  if (r){
                    this.authService.refreshSession().subscribe((response)=>{
                      infoMessage('success','Listo','Información actualizada correctamente, serás redirigido al inicio','¡De acuerdo!');
                      LogoutForce(this.authService,this.router);
                      this.editingGral = false;
                    });
                  }else{
                    infoMessage('error','Algo salió mal','No fue posible editar la informacion, intentalo de nuevo más tarde','ok');
                  }
                },error=>{
                  infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok');
                });
              },error=>{
                Swal.showValidationMessage(
                  `${error.error.notifications ? error.error.notifications[0].descripcion:"Error desconocido"}`
                );
                return false;
              });
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Resultado"
              })
            }
          });
        }else{
        this.providerService.updateUserContact(providerObj).subscribe((r)=>{
          if (r){
            this.authService.refreshSession().subscribe((response)=>{
              this.authService.setUser(response);
              infoMessage('success','Listo','Información actualizada correctamente','¡De acuerdo!');
              this.editingContact = false;
              this.ngOnInit();
            });
          }else{
            infoMessage('error','Algo salió mal','No fue posible editar la informacion, intentalo de nuevo más tarde','ok');
          }
        },error=>{
          infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok');
        });
        }
      }
    });
  }
  deactivate(){
    if(this.currentProvider.active){
      Swal.fire({
          title: 'Confirmar',
          text: "¿Desea desactivar su cuenta? Su negocio no será visible para nadie si desactiva su cuenta",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Sí, continuar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.providerService.deactivate({id:this.currentProvider.id,active:false}).subscribe((r)=>{
              if (r){
                this.authService.refreshSession().subscribe((response)=>{
                  this.authService.setUser(response);
                  infoMessage('success','Listo','Se ha desactivado correctamente la cuenta','¡De acuerdo!');
                  LogoutForce(this.authService,this.router);
                  this.editingGral = false;
                  this.ngOnInit();
                });
              }else{
                infoMessage('error','Algo salió mal','No fue posible editar la informacion, intentalo de nuevo más tarde','ok');
              }
            },error=>{
              infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok');
            });
          }
        });
    }else{
      this.providerService.deactivate({id:this.currentProvider.id,active:true}).subscribe((r)=>{
        if (r){
          this.authService.refreshSession().subscribe((response)=>{
            this.authService.setUser(response);
            infoMessage('success','Listo','Se ha activado correctamente la cuenta','¡De acuerdo!');
            this.editingGral = false;
            this.ngOnInit();
          });
        }else{
          infoMessage('error','Algo salió mal','No fue posible editar la informacion, intentalo de nuevo más tarde','ok');
        }
      },error=>{
        infoMessage('error','Imposible actualizar la información',error.error.notifications[0].descripcion,'ok');
      });
    }
  }
}
