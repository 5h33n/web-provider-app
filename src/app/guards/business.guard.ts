import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class NegocioGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(){
    if(this.authService.getCurrentUser().tipo === "negocio"){
      return true;
    }else{
      this.router.navigate(['/inicio'])
      return false;
    }
  }
}