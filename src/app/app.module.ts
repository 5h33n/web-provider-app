import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//MATERIAL
import { MaterialModule } from './material/material.module';
//ng2-charts
import { ChartsModule } from 'ng2-charts';
//ngnx-charts
import { NgxChartsModule } from '@swimlane/ngx-charts';
//ngnx google maps
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
// COMPONENTES
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoaderComponent } from './components/auth/loader/loader.component';
import { MainComponent } from './components/dashboard/main/main.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { ConfigComponent } from './components/admin/config/config.component';
import { HttpClientModule } from '@angular/common/http';
import { VerifyComponent } from './components/auth/register/verify/verify.component';
import { BusinessComponent } from './components/auth/register/business/business.component';
import { InfoComponent } from './components/dashboard/info/info.component';
import { InventoriesComponent } from './components/dashboard/inventories/inventories.component';
import { StatsComponent } from './components/dashboard/stats/stats.component';
import { BreadcumbsComponent } from './components/dashboard/breadcumbs/breadcumbs.component';
import { ProductsDialogComponent } from './components/dashboard/inventories/products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    LoaderComponent,
    MainComponent,
    ProfileComponent,
    ConfigComponent,
    VerifyComponent,
    BusinessComponent,
    InfoComponent,
    InventoriesComponent,
    StatsComponent,
    BreadcumbsComponent,
    ProductsDialogComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
