import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coil } from '../components/models/coil';


@Injectable()
export class CoilService{

  private url: string = "http://localhost:3200/api/coils";

  constructor(private client: HttpClient) { }

  getCoils(): Observable<Coil[]> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.client.get<Array<Coil>>(this.url, { headers: headers });


  }

  getCoil(id: string): Observable<Coil> {

    const headers: HttpHeaders = new HttpHeaders().set("Content_Type", "application/json");

    return this.client.get<Coil>(this.url + `/${id}`, { headers: headers });

  }

  postCoil(coil: Coil): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.client.post<Coil>(this.url + "/postcoil", JSON.stringify(coil), { headers: headers });


  }

  editCoil(coil: Coil): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", 'application/json');

    return this.client.put<Coil>(this.url + "/putcoil", JSON.stringify(coil), { headers: headers });

  }

  deleteCoil(id: string): Observable<any> {

    return this.client.delete<Coil>(this.url + `/deletecoil/${id}`);

  }

}
