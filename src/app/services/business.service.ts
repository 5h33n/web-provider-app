import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '../models/store';
import { Backend2 } from './backend';
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private _BUSINESS_API = Backend2+":3030/";
  headers : HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  constructor(private http: HttpClient) { }
  createStore(store:any): Observable<any>{
    const url_api = this._BUSINESS_API+'store/nuevo';
    return this.http.post(url_api,store,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  getStore(id:string){
    const url_api = this._BUSINESS_API+'store/negocioid/'+id;
    return this.http.get(url_api,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  getGiros(){
    const url_api = this._BUSINESS_API+'business/listar';
    return this.http.get(url_api,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  addGiro(name:string): Observable<any>{
    const url_api = this._BUSINESS_API+'business/nuevo';
    return this.http.post(url_api,{name},{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  getTags(references:string){
    const url_api = this._BUSINESS_API+'store/tags?tags='+references;
    return this.http.get(url_api,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
}
