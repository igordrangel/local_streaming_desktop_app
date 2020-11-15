import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export const API_URL = 'http://localhost:9090';

@Injectable({providedIn: "root"})
export class LocalStreamingService {
  private urlServer = 'http://localhost:3000'
  
  constructor(private http: HttpClient) {
  }
  
  public novoVideo(data: any) {
    return this.http.post(this.urlServer + '/video', data).toPromise();
  }
}
