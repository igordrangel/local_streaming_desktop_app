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

@NgModule({
  declarations: [
    AppComponent,
    PageVideosComponent,
    DialogFormEnvioVideoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxKoalaModule,
    NgxElectronModule,
    KoalaFolderPageModule,
    KoalaQuestionModule,
    KoalaDialogModule,
    KoalaButtonModule,
    KoalaFormModule,
    MatCardModule,
    ToolbarModule,
    FooterModule,
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
