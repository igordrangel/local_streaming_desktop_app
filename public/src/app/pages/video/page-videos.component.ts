import { Component } from "@angular/core";
import { KoalaDialogService } from "ngx-koala";
import { DialogFormEnvioVideoComponent } from "./forms/dialog-form-envio-video.component";

@Component({
	templateUrl: 'page-videos.component.html',
	styleUrls: ['page-videos.component.css']
})
export class PageVideosComponent {
	
	constructor(
		private dialog: KoalaDialogService
	) {}
	
	public novoVideo() {
		this.dialog.open(
			DialogFormEnvioVideoComponent,
			'normal',
			null,
			'reloadList',
			() => {}
		);
	}
}
