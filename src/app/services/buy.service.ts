import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBuy } from '../components/models/IBuy.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IImage } from '../components/models/IImage.interface';

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

  postImage(img: File): Observable<any> {

    let formdata = new FormData();
    formdata.append("imagedata", img, img.name);

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "multipart/form-data; boundary = AaB03x " });
    return this.httpclient.post<any>(this.url + '/postimg', formdata);

  }

  postBuy(buy: IBuy): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.post<IBuy>(this.url + '/postbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  putBuy(buy: IBuy): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.put<IBuy>(this.url + '/putbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  deleteBuy(id: string,imgid:string): Observable<any> {

    const httheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.delete<any>(this.url + `/deletebuy/${id}/${imgid}`, { observe: "body", headers: httheaders, responseType: "json" });
  }

}
