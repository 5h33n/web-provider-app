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

  private _ONBOARDING_API = "https://"+Backend+":2020/";
  private _PROVIDERSECURITY_API = "https://"+Backend+":1010/";

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
    localStorage.removeItem("currentProvider");
    this.userSubject.next(undefined);
    const url_api = this._PROVIDERSECURITY_API+'api/cerrar';
    return this.http.get(url_api,{withCredentials:true}).pipe(map(data => data));
  }
  registerUser(user:Provider): Observable<any>{
    const url_api = this._ONBOARDING_API+'provider/newProvider';
    return this.http.post(url_api,user,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  updateUser(contactInfo:any): Observable<any>{
    const url_api = this._ONBOARDING_API+'provider/editarC';
    return this.http.put(url_api,contactInfo,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  resendCode(id:string){
    const url_api = this._PROVIDERSECURITY_API+'api/reenviar-codigo';
    return this.http.post(url_api,id,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
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

  accountConfirm(info:any):Observable<any>{
    const url_api = this._PROVIDERSECURITY_API+'api/comprobar-Token';
    return this.http.post(url_api,info,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
  }
  getSession(){
    const url_api = this._ONBOARDING_API+'provider/session';
    return this.http.get(url_api,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
  }
}
