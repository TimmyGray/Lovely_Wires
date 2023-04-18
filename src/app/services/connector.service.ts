import { Connector } from '../components/models/connector';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ConnectorService {

  private url: string = environment.apiUrl+"/connectors";

  constructor(private client: HttpClient) { }

  getConnectors(): Observable<Array<Connector>> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.get<Array<Connector>>(this.url, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  getConnector(id: string): Observable<Connector> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.client.get<Connector>(this.url + `/${id}`, { headers: httpheaders});

  }


  getConnectorByNameAndType(name: string, type: string): Observable<Connector> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.get<Connector>(this.url + `/getconnectorbynameandtype/${name}/${type}`, { headers: httpheaders });

  }

  postConnector(connector: Connector): Observable<Connector> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.post<Connector>(this.url+'/postconn', JSON.stringify(connector), { headers: httpheaders });

  }

  putConnector(connector: Connector): Observable<Connector> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.put<any>(this.url + '/putconn', JSON.stringify(connector), { headers: httpheaders });

  }

  putArrayOfConnectors(connectors: Connector[]): Observable<Connector[]> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.client.put<Connector[]>(this.url + "/putarrayofconn", JSON.stringify(connectors), { headers: httpheaders });

  }

  deleteConnector(_id: string): Observable<Connector> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

    return this.client.delete<any>(this.url + `/deleteconn/${_id}`,{ headers: httpheaders });

  }


}
