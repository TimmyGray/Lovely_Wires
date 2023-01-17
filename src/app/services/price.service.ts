import { Price } from '../components/models/price';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Injectable()
export class PriceService {

  private url: string = "http://localhost:3200/api/prices";

  constructor(private client: HttpClient) { }

  getPrices(): Observable<Array<Price>> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.get<Array<Price>>(this.url, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  postPrice(price: Price): Observable<any> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.post<Price>(this.url + '/postprice', JSON.stringify(price), { headers: httpheaders });

  }

  putPrice(price: Price): Observable<any> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.put<Price>(this.url + '/putprice', JSON.stringify(price), { headers: httpheaders });

  }

  deletePrice(_id: string): Observable<any>{

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.delete<Price>(this.url + `/deleteprice/${_id}`, { headers: httpheaders });

    }

}
