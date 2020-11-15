import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WindowEnum } from "./enums/window.enum";
import { API_URL } from '../../core/local-streaming.service';
import { ResponseInterface } from "../../../../../server/interfaces/response.interface";

@Injectable({providedIn: "root"})
export class ToolbarService {
  constructor(private http: HttpClient) {
  }
  
  public open(dados: {
    enumWindow: WindowEnum;
    url: string;
    nameWindow: string;
  }) {
    return this.http.post<ResponseInterface[]>(API_URL + "/electron/open", dados);
  }
  
  public flashFrame(enumWindow: number) {
    return this.http.post<ResponseInterface[]>(API_URL + "/electron/flash-frame", {
      enumWindow
    });
  }
  
  public restore(enumWindow: number) {
    return this.http.post<ResponseInterface[]>(API_URL + "/electron/restore", {
      enumWindow
    });
  }
  
  public close(enumWindow?: number[]) {
    return this.http.post<ResponseInterface[]>(API_URL + "/electron/close", {
      enumWindow
    });
  }
}
