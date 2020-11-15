import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageVideosComponent } from "./pages/video/page-videos.component";

const routes: Routes = [
  {path: '**', redirectTo: 'videos'},
  {path: 'videos', component: PageVideosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
