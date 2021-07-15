import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class NegocioGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot){
    if(this.authService.getCurrentBusiness()=="null"){
      if(route.routeConfig!.path == "dashboard"){
        this.router.navigate(['/business'])
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
}