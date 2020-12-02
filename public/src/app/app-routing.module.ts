import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageVideosComponent } from "./pages/video/page-videos.component";
import { VideoComponent } from "./pages/video/visualizar/video.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'videos'},
  {path: 'videos', component: PageVideosComponent},
  {path: 'video/:id', component: VideoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
