import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wire } from '../components/models/wire';
import { Observable } from 'rxjs';


@Injectable()
export class WireService {

  private url = "http://localhost:3200/api/wires";


  constructor(private http: HttpClient) { }

  getWires(): Observable<any> {

    return this.http.get<Array<Wire>>(this.url);
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
