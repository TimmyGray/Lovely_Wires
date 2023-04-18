import { Price } from '../components/models/price';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable()
export class PriceService {

  private url: string = environment.apiUrl+"/prices";

  constructor(private client: HttpClient) { }

  getPrices(): Observable<Price[]> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.get<Price[]>(this.url, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  getPrice(id: string): Observable<Price> {

    return this.client.get<Price>(this.url + `/${id}`);

  }

  getArrayOfPrices(arrayofids: string[]): Observable<Price[]> {

    let params = { arrayofprices: arrayofids };
    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "applicaton/json", "Params": `${JSON.stringify(params)}` });
    return this.client.get<Price[]>(this.url + '/arrayofprices', { observe: "body", headers: httpheaders });

  }

  postPrice(price: Price): Observable<Price> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.post<Price>(this.url + '/postprice', JSON.stringify(price), { headers: httpheaders });

  }

  putPrice(price: Price): Observable<Price> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.put<Price>(this.url + '/putprice', JSON.stringify(price), { headers: httpheaders });

  }

  deletePrice(_id: string): Observable<Price>{

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.delete<Price>(this.url + `/deleteprice/${_id}`, { headers: httpheaders });

    }

}
