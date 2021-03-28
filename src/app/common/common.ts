import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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