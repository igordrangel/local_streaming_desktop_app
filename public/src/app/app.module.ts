import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarModule } from "./shared/toolbar/toolbar.module";
import { FooterModule } from "./shared/footer/footer.module";
import {
  KoalaAlertService,
  KoalaButtonModule,
  KoalaDialogModule,
  KoalaDialogService,
  KoalaFolderPageModule,
  KoalaFormModule,
  KoalaQuestionModule,
  KoalaQuestionService,
  KoalaRequestService,
  NgxKoalaModule
} from "ngx-koala";
import { PageVideosComponent } from "./pages/video/page-videos.component";
import { NgxElectronModule } from "ngx-electron";
import { DialogFormEnvioVideoComponent } from "./pages/video/forms/dialog-form-envio-video.component";
import { MatCardModule } from "@angular/material/card";
import { VideoComponent } from "./pages/video/visualizar/video.component";
import { DialogFormEnvioArquivoComponent } from "./pages/video/visualizar/forms/dialog-form-envio-arquivo.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent,
    PageVideosComponent,
    VideoComponent,
    DialogFormEnvioVideoComponent,
    DialogFormEnvioArquivoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToolbarModule,
    FooterModule,
    NgxElectronModule,
    NgxKoalaModule,
    KoalaFolderPageModule,
    KoalaQuestionModule,
    KoalaDialogModule,
    KoalaButtonModule,
    KoalaFormModule,
    MatCardModule,
    MatStepperModule,
    MatProgressBarModule,
    AppRoutingModule
  ],
  providers: [
    KoalaQuestionService,
    KoalaDialogService,
    KoalaRequestService,
    KoalaAlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
