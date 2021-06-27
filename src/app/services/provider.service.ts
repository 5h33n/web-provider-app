import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Provider } from '../models/provider';
import { Backend } from './backend';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {
    private _ONBOARDING_API = Backend+":2020/";
    private _PROVIDERSECURITY_API = Backend+":1010/";
    constructor(private http: HttpClient) {

    }
    headers : HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json"
    });
    registerUser(user:Provider): Observable<any>{
        const url_api = this._ONBOARDING_API+'provider/newProvider';
        return this.http.post(url_api,user,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
    }
    updateUserInfo(generalInfo:any): Observable<any>{
        const url_api = this._ONBOARDING_API+'provider/editar';
        return this.http.put(url_api,generalInfo,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
    }
    updateUserContact(contactInfo:any): Observable<any>{
        const url_api = this._ONBOARDING_API+'provider/editarC';
        return this.http.put(url_api,contactInfo,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
    }
    getProviderById(id:string){
        const url_api = `${this._ONBOARDING_API}provider/provider-id/${id}`;
        return this.http.get(url_api,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
    }
    deactivate(provider:any){
        const url_api = `${this._ONBOARDING_API}provider/desactivar`;
        return this.http.put(url_api,provider,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
    }
    updatePhoto(file:any){
        const url_api = `${this._ONBOARDING_API}provider/uploadFile`;
        return this.http.put(url_api,file,{headers:this.headers,withCredentials:true}).pipe(map(response=>response));
    }
}