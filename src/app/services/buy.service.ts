import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBuy } from '../components/models/IBuy.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BuyService {

  private url: string = "http://localhost:3200/api/buys";

  constructor(private httpclient: HttpClient) { }

  getBuys(): Observable<IBuy[]> {

    return this.httpclient.get<IBuy[]>(this.url);

  }

  getBuy(id: string): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.get<IBuy>(this.url + `/${id}`, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  postBuy(buy: IBuy): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.post<IBuy>(this.url + '/postbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  putBuy(buy: IBuy): Observable<any> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.put<any>(this.url + '/putbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  deleteBuy(id: string): Observable<any> {

    const httheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.delete<any>(this.url + `/deletebuy/${id}`, { observe: "body", headers: httheaders, responseType: "json" });
  }

}
