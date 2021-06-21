import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoaderComponent } from './components/auth/loader/loader.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { VerifyComponent } from './components/auth/register/verify/verify.component';
import { BusinessComponent } from './components/auth/register/business/business.component';
//GUARDS
import { AuthGuard } from './guards/auth.guard';
import { VerifiedGuard } from './guards/verified.guard';

const routes: Routes = [
  {path: '',component: LoaderComponent},
  {path: 'dashboard',component: DashboardComponent, canActivate: [AuthGuard,VerifiedGuard]},
  {path: 'login',component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'register',component: RegisterComponent},
  {path: 'profile',component:ProfileComponent,canActivate: [AuthGuard,VerifiedGuard]},
  {path: 'verify',component:VerifyComponent,canActivate: [AuthGuard]},
  {path: 'business',component:BusinessComponent, canActivate: [AuthGuard,VerifiedGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
