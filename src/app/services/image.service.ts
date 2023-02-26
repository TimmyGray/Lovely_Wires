import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ImageService {

  private readonly url: string = "http://localhost:3200/api/images";


}
