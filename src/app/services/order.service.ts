import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../components/models/order';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService {

  private url: string = 'http://localhost:3200/api/orders';
  constructor(private httpclient: HttpClient) { }
  getOrders(): Observable<Array<Order>>{

    const httpheaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<Array<Order>>(this.url, { observe: 'body', headers: httpheaders, responseType: 'json' });

  }

  putOrder(order: Order): Observable<any> {

    const httpheaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.put<Order>(this.url + '/putorder', JSON.stringify(order), { headers: httpheaders });

  }

  deleteOrder(id: string): Observable<any> {

    return this.httpclient.delete(this.url +'/deleteorder'+`/${id}`);

  }

}
