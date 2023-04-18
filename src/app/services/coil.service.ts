import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coil } from '../components/models/coil';
import { environment } from '../../environments/environment';

@Injectable()
export class CoilService{

  private url: string = environment.apiUrl+"/coils";

  constructor(private client: HttpClient) { }

  getCoils(): Observable<Coil[]> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.client.get<Array<Coil>>(this.url, { headers: headers });


  }

  getCoil(id: string): Observable<Coil> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.client.get<Coil>(this.url + `/${id}`, { headers: headers });

  }

  getCoilByNameAndType(name: string, type: string): Observable<Coil> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.get<Coil>(this.url + `/getcoilbynameandtype/${name}/${type}`, { headers: httpheaders });

  }

  postCoil(coil: Coil): Observable<Coil> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this.client.post<Coil>(this.url + "/postcoil", JSON.stringify(coil), { headers: headers });


  }

  editCoil(coil: Coil): Observable<Coil> {

    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", 'application/json');

    return this.client.put<Coil>(this.url + "/putcoil", JSON.stringify(coil), { headers: headers });

  }

  deleteCoil(id: string): Observable<Coil> {

    return this.client.delete<Coil>(this.url + `/deletecoil/${id}`);

  }

}
