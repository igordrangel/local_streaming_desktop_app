import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { VideoInterface } from "../video.interface";
import { LocalStreamingService } from "../../../core/local-streaming.service";
import { ActivatedRoute } from "@angular/router";
import { VideoTipoEnum } from "../forms/enums/video-tipo.enum";
import { VideoCategoriaEnumTranslate } from "../forms/enums/translate/video-categoria.enum.translate";
import { DialogFormEnvioVideoComponent } from "../forms/dialog-form-envio-video.component";
import { KoalaDialogService } from "ngx-koala";
import { DialogFormEnvioArquivoComponent } from "./forms/dialog-form-envio-arquivo.component";
import { VideoArquivoInterface } from "../video-arquivo.interface";
import { koala } from "koala-utils";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";

interface ListaArquivos {
	temporada: number;
	arquivos: VideoArquivoInterface[];
}

@Component({
	templateUrl: 'video.component.html',
	styleUrls: ['video.component.css']
})
export class VideoComponent implements OnInit {
	public video$: Observable<VideoInterface>;
	public videoTipo = VideoTipoEnum;
	public videoCategoriaTranslate = VideoCategoriaEnumTranslate;
	
	private video: VideoInterface;
	
	constructor(
		private activatedRoute: ActivatedRoute,
		private localStreamingService: LocalStreamingService,
		private dialog: KoalaDialogService
	) {}
	
	ngOnInit() {
		this.activatedRoute
		    .params
		    .subscribe(async params => {
			    const id = params.id;
			    if (id) await this.loadVideo(id);
		    });
	}
	
	public editar() {
		this.dialog.open(
			DialogFormEnvioVideoComponent,
			'normal',
			this.video,
			'reloadList',
			() => this.loadVideo(this.video.id)
		);
	}
	
	public dialogArquivo(arquivo?: VideoArquivoInterface) {
		this.dialog.open(
			DialogFormEnvioArquivoComponent,
			'normal',
			{
				idVideo: this.video.id,
				arquivo
			},
			'reload',
			() => this.loadVideo(this.video.id)
		);
	}
	
	public getListaArquivos(): ListaArquivos[] {
		return koala(this.video.arquivos)
			.array<VideoArquivoInterface>()
			.pipe(klArray => {
				const listaArquivos: ListaArquivos[] = [];
				
				klArray.getValue().forEach(arquivo => {
					const index = koala(listaArquivos).array<ListaArquivos>().getIndex('temporada', arquivo.temporada);
					if (index >= 0) {
						listaArquivos[index].arquivos.push(arquivo);
					} else {
						listaArquivos.push({
							temporada: arquivo.temporada,
							arquivos: [arquivo]
						})
					}
				});
				
				return listaArquivos;
			})
			.orderBy('temporada')
			.getValue();
	}
	
	private async loadVideo(id: number) {
		this.video = null;
		this.video$ = null;
		await KlDelay.waitFor(300);
		this.video$ = this.localStreamingService.getPorId(id);
		this.video$.subscribe(video => this.video = video);
	}
}
