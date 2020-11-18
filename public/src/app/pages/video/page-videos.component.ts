import { Component } from "@angular/core";
import { KoalaDialogService } from "ngx-koala";
import { DialogFormEnvioVideoComponent } from "./forms/dialog-form-envio-video.component";
import { LocalStreamingService } from "../../core/local-streaming.service";
import { switchMap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { PosterInterface } from "./poster.interface";
import { VideoInterface } from "./video.interface";
import { VideoCategoriaEnumTranslate } from "./forms/enums/translate/video-categoria.enum.translate";

@Component({
	templateUrl: 'page-videos.component.html',
	styleUrls: ['page-videos.component.css']
})
export class PageVideosComponent {
	public categoriaTranslate = VideoCategoriaEnumTranslate;
	public videos$ = this.getLista();
	
	constructor(
		private dialog: KoalaDialogService,
		private localStreamingService: LocalStreamingService
	) {}
	
	public novoVideo() {
		this.dialog.open(
			DialogFormEnvioVideoComponent,
			'normal',
			null,
			'reloadList',
			() => this.videos$ = this.getLista()
		);
	}
	
	private getLista() {
		return this.localStreamingService
		           .getLista()
		           .pipe(switchMap(videos => {
			           return new Observable<VideoInterface[]>(observe => {
				           videos.map(video => {
					           video.poster = new BehaviorSubject<PosterInterface>({
						           src: './assets/poster-default.jpg',
						           alt: 'Video de Teste'
					           });
				           });
				           observe.next(videos);
			           });
		           }));
	}
}
