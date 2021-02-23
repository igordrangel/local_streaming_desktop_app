import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarModule } from "./shared/toolbar/toolbar.module";
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
import { DialogFormEnvioVideoComponent } from "./pages/video/forms/dialog-form-envio-video.component";
import { MatCardModule } from "@angular/material/card";
import { VideoComponent } from "./pages/video/visualizar/video.component";
import { DialogFormEnvioArquivoComponent } from "./pages/video/visualizar/forms/dialog-form-envio-arquivo.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

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
    NgxKoalaModule,
    KoalaFolderPageModule,
    KoalaQuestionModule,
    KoalaDialogModule,
    KoalaButtonModule,
    KoalaFormModule,
    MatCardModule,
    MatStepperModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
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
