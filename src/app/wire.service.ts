import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wire } from './components/wire';

@Injectable()
export class WireService {

  private url = "http://localhost:3000/api/wires";


  constructor(private http: HttpClient) { }

  getWires() {

    return this.http.get<Array<Wire>>(this.url);
  }

  postWire(wire: Wire) {

    const httpheaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post<Wire>(this.url+'/post', JSON.stringify(wire), { headers: httpheaders });

  }

  editWire(wire: Wire) {

    const httpheaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.put<Wire>(this.url + '/edit', JSON.stringify(wire), { headers: httpheaders });

  }

  deleteWire(id: string) {

    return this.http.delete<Wire>(this.url + '/delete/' + id);

  }

}
