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

  private _BUSINESS_API = "https://"+Backend2+":3030/";
  headers : HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  constructor(private http: HttpClient) { }
  createStore(store:any): Observable<any>{
    const url_api = this._BUSINESS_API+'store/nuevo';
    return this.http.post(url_api,store,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
}
