import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(){
      if(this.authService.getCurrentUser().verifiedAt){
          return true;
      }else{
          this.router.navigate(['verify'])
          return false;
      }
  }
}