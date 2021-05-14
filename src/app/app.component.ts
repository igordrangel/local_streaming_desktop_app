import { Component } from '@angular/core';
import { KoalaQuestionService } from "ngx-koala";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [KoalaQuestionService]
})
export class AppComponent {
}
