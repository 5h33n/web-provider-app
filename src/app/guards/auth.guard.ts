import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean>{
    try{
        const val = await this.authService.getSession().toPromise() ? true : false;
        if (val===true){
            const currenUser = this.authService.getCurrentUser();
            if (!currenUser){
                this.authService.refreshSession().subscribe((response)=>{
                    this.authService.setUser(response);
                });
            }
        }
        if (route.routeConfig!.path === 'login'){
            if(this.authService.getCurrentUser().verifiedAt){
                this.router.navigate(['dashboard']);
              }else{
                this.router.navigate(['verify'],{ queryParams: { r: this.authService.getCurrentUser().id }});
              }
            return !val;
        }else{
            return val;
        }
    }catch(err){
        if (route.routeConfig!.path === 'login'){
            return true;
        }else{
            this.router.navigate(["login"]);
            return false;
        }
    }
  }
}