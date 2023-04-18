import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBuy } from '../components/models/IBuy.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IImage } from '../components/models/IImage.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class BuyService {

  private url: string = environment.apiUrl+"/buys";

  constructor(private httpclient: HttpClient) {
  }

  getBuys(): Observable<IBuy[]> {

    return this.httpclient.get<IBuy[]>(this.url);

  }

  getBuy(id: string): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.get<IBuy>(this.url + `/${id}`, { observe: "body", headers: httpheaders, responseType: "json" });

  }

  getBuyByItem(item: string): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.get<any>(this.url + `/getitembuy/${item}`, { observe: 'body', headers: httpheaders, responseType: "json" });

  }

  getArrayOfBuys(buystoget: string[]): Observable<IBuy[]> {

    let params = { arrayofbuys: buystoget };
	
    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json", "Params": `${JSON.stringify(params)}` });

    return this.httpclient.get<IBuy[]>(this.url + '/arrayofbuys', { headers: httpheaders });

  }

  getImage(id: string, type: string): Observable<Blob> {

    const httpheaders: HttpHeaders = new HttpHeaders({ 'Content-Type': `image/${type}` });
    return this.httpclient.get(`${this.url}/getimg/${id}`, { responseType: 'blob', headers: httpheaders });

  }

  postImage(img: File): Observable<IImage> {

    let formdata = new FormData();
    formdata.append("imagedata", img, img.name);

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "multipart/form-data; boundary = AaB03x " });
    return this.httpclient.post<any>(this.url + '/postimg', formdata);

  }


  postBuy(buy: IBuy): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.post<IBuy>(this.url + '/postbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  putImage(img: File, imgid: string): Observable<IImage> {

    let formdata: FormData = new FormData();
    formdata.append("editimagedata", img, img.name);

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "multipart/form-data; biundary = AaB03x" });
    return this.httpclient.put<any>(this.url + `/putimg/${imgid}`, formdata);

  }

  putBuy(buy: IBuy): Observable<IBuy> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.put<IBuy>(this.url + '/putbuy', JSON.stringify(buy), { headers: httpheaders });

  }

  putArrayOfBuys(buys: IBuy[]): Observable<IBuy[]> {

    const httpheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.put<any>(this.url + '/putarrayofbuys', JSON.stringify(buys), { headers: httpheaders });

  }

  deleteBuy(id: string, imgid: string): Observable<any> {
    const httheaders: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpclient.delete<any>(this.url + `/deletebuy/${id}/${imgid}`, { observe: "body", headers: httheaders, responseType: "json" });
  }

}
