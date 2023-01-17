import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Wire } from '../components/models/wire';
import { Observable } from 'rxjs';


@Injectable()
export class WireService {

  private url = "http://localhost:3200/api/wires";


  constructor(private http: HttpClient) { }

  getWires(): Observable<any> {

    return this.http.get<Array<Wire>>(this.url);
  }

  getOrderWires(order: number, group: string): Observable<any> {

    return this.http.get<Array<Wire>>(this.url + `/` + group + `/` + order);

  }

  getRangeOfWires(wiresid:string[]): Observable<any> {

    const httpheaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post<Wire[]>(this.url + '/rangeofwires', JSON.stringify(wiresid), { headers: httpheaders });

  }

  getWire(id: string): Observable<Wire> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.get<Wire>(this.url + `/${id}`, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  postWire(wire: Wire): Observable<any> {

    const httpheaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post<Wire>(this.url+'/postwire', JSON.stringify(wire), { headers: httpheaders });

  }

  editWire(wire: Wire): Observable<any> {

    const httpheaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.put<Wire>(this.url + '/editwire', JSON.stringify(wire), { headers: httpheaders });

  }

  deleteWire(id: string): Observable<any> {

    return this.http.delete<Wire>(this.url + '/deletewire/' + id);

  }

}
