import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VideoInterface } from "../pages/video/video.interface";

export const API_URL = 'http://localhost:9090';

@Injectable({providedIn: "root"})
export class LocalStreamingService {
  private urlServer = 'http://localhost:3000'
  
  constructor(private http: HttpClient) {
  }
  
  public novoVideo(data: any) {
    return this.http.post(this.urlServer + '/video', data).toPromise();
  }
  
  public editar(id: number, data: any) {
    return this.http.put(this.urlServer + '/video/' + id, data).toPromise();
  }
  
  public excluir(id: number) {
    return this.http.delete(this.urlServer + '/video/' + id).toPromise();
  }
  
  public getLista() {
    return this.http.get<VideoInterface[]>(this.urlServer + '/videos');
  }
}
