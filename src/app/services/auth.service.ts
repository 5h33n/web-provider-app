import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Provider } from '../models/provider';
import { Backend } from './backend';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _ONBOARDING_API = Backend+":2020/";
  private _PROVIDERSECURITY_API = Backend+":1010/";

  currentProvider?: Provider = new Provider();
  private userSubject = new BehaviorSubject(this.currentProvider);
  constructor(private http: HttpClient) {

  }
  headers : HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  login(credentials:any): Observable<HttpResponse<any>>{
    const url_api = this._PROVIDERSECURITY_API+'api/login';
    return this.http.post<HttpResponse<any>>(url_api,credentials,{headers:this.headers, observe: "response", withCredentials: true});
  }
  logout() {
    const url_api = this._PROVIDERSECURITY_API+'api/cerrar';
    return this.http.get(url_api,{withCredentials:true}).pipe(map(data => data));
  }
  setUser(user: Provider): void{
    let user_string = JSON.stringify(user);
    this.currentProvider = user;
    localStorage.setItem("currentProvider",user_string);
    this.userSubject.next(this.currentProvider);
  }
  getCurrentUser(){
    let user_string = localStorage.getItem("currentProvider");
    return user_string ? JSON.parse(user_string): null;
  }
  setBusiness(business: string): void{
    localStorage.setItem("businessId",business);
  }
  getCurrentBusiness(){
    let business_string = localStorage.getItem("businessId");
    return business_string ? business_string: null;
  }
  removeLocalUser(){
    localStorage.removeItem("businessId");
    localStorage.removeItem("currentProvider");
    this.userSubject.next(undefined);
  }
  accountConfirm(info:any):Observable<any>{
    const url_api = this._PROVIDERSECURITY_API+'api/comprobar-Token';
    return this.http.post(url_api,info,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
  }
  resendCode(id:string){
    const url_api = this._PROVIDERSECURITY_API+'api/reenviar-codigo';
    return this.http.post(url_api,id,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  getSession():Observable<any>{
    const url_api = this._PROVIDERSECURITY_API+'api/session';
    return this.http.get(url_api,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
  }
  refreshSession():Observable<any>{
    const url_api = this._PROVIDERSECURITY_API+'api/refreshSession';
    return this.http.get(url_api,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
  }
}
