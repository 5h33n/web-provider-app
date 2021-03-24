import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoaderComponent } from './components/auth/loader/loader.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { VerifyComponent } from './components/auth/register/verify/verify.component';
import { BusinessComponent } from './components/auth/register/business/business.component';

const routes: Routes = [
  {path: '',component: LoaderComponent},
  {path: 'dashboard',component: DashboardComponent},
  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'profile',component:ProfileComponent},
  {path: 'verify',component:VerifyComponent},
  {path: 'business',component:BusinessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
