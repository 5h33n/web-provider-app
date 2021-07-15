import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Backend2 } from './backend';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _PRODUCTS_API = Backend2+":4040/";
  headers : HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  constructor(private http: HttpClient) { }
  getProducts(id:string|null){
    const url_api = this._PRODUCTS_API+'productos/productoidstore/'+id;
    return this.http.get(url_api,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
  addProduct(product:any): Observable<any>{
    const url_api = this._PRODUCTS_API+'productos/nuevo';
    return this.http.post(url_api,product,{headers:this.headers, withCredentials:true}).pipe(map(data=>data));
  }
}
