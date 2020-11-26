import { Component } from "@angular/core";
import { ElectronService } from 'ngx-electron';
import { KoalaQuestionService } from "ngx-koala";

@Component({
  selector: "app-toolbar",
  templateUrl: "toolbar.component.html",
  styleUrls: ["toolbar.component.css"]
})
export class ToolbarComponent {
  public fullscreenMode: boolean = false;
  
  constructor(
    private _electronService: ElectronService,
    private question: KoalaQuestionService
  ) {
    if (this._electronService.isElectronApp) {
      setInterval(() => this.fullscreenMode = this._electronService.remote.getCurrentWindow().isMaximized(), 50);
    }
  }
  
  public minimize() {
    this._electronService.remote.getCurrentWindow().minimize();
  }
  
  public resize() {
    const currentWindow = this._electronService.remote.getCurrentWindow();
    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize();
    } else {
      currentWindow.maximize();
    }
  }
  
  public close() {
    this.question.open({
      message: 'Deseja mesmo sair da aplicação?'
    }, () => this._electronService.remote.getCurrentWindow().close());
  }
}
