import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VideoInterface } from "../pages/video/video.interface";
import { IpServer } from "../shared/ip/ip-server";

export const API_URL = 'http://localhost:9090';

@Injectable({providedIn: "root"})
export class LocalStreamingService {
  
  constructor(private http: HttpClient) {
  }
  
  public getPorId(id: number) {
    return this.http.get<VideoInterface>(IpServer.getHost() + '/video/' + id);
  }
  
  public novoVideo(data: any) {
    return this.http.post(IpServer.getHost() + '/video', data).toPromise();
  }
  
  public editar(id: number, data: any) {
    return this.http.put(IpServer.getHost() + '/video/' + id, data).toPromise();
  }
  
  public excluir(id: number) {
    return this.http.delete(IpServer.getHost() + '/video/' + id).toPromise();
  }
  
  public getLista(params: any) {
    return this.http.get<VideoInterface[]>(IpServer.getHost() + '/videos', {params});
  }
  
  public addArquivo(idVideo: number, data: any) {
    return this.http.post(IpServer.getHost() + '/video/' + idVideo + '/arquivo', data).toPromise();
  }
  
  public editarArquivo(id: number, data: any) {
    return this.http.put(IpServer.getHost() + '/video/arquivo/' + id, data).toPromise();
  }
  
  public deletarArquivo(id: number) {
    return this.http.delete(IpServer.getHost() + '/video/arquivo/' + id).toPromise();
  }
}
