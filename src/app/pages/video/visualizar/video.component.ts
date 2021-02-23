import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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
	public video$ = new BehaviorSubject<VideoInterface>(null);
	public videoTipo = VideoTipoEnum;
	public videoCategoriaTranslate = VideoCategoriaEnumTranslate;
  public playlist: ListaArquivos[];

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
			this.video$.getValue(),
			'reloadList',
			() => this.loadVideo(this.video$.getValue().id)
		);
	}

	public dialogArquivo(arquivo?: VideoArquivoInterface) {
		this.dialog.open(
			DialogFormEnvioArquivoComponent,
			'normal',
			{
				idVideo: this.video$.getValue().id,
				arquivo
			},
			'reload',
			() => this.loadVideo(this.video$.getValue().id)
		);
	}

	private async loadVideo(id: number) {
		this.video$.next(null);
		await KlDelay.waitFor(50);
		this.localStreamingService
		    .getPorId(id)
		    .subscribe(video => {
          this.video$.next(video);
          this.setPlaylist();
        });
	}

  private setPlaylist() {
    this.playlist = [];
    setTimeout(() => {
      this.playlist = koala(this.video$.getValue()?.arquivos ?? [])
        .array<VideoArquivoInterface>()
        .pipe(klArray => {
          let listaArquivos: ListaArquivos[] = [];

          klArray.getValue().forEach(arquivo => {
            const index = koala(listaArquivos).array<ListaArquivos>().getIndex('temporada', arquivo.temporada);
            if (index >= 0) {
              listaArquivos[index].arquivos.push(arquivo);
            } else {
              listaArquivos.push({
                temporada: arquivo.temporada,
                arquivos: [arquivo]
              });
            }
          });

          listaArquivos = listaArquivos.map(itemArquivo => {
            itemArquivo.arquivos = koala(itemArquivo.arquivos).array<VideoArquivoInterface>().orderBy('titulo').getValue();
            return itemArquivo;
          });

          return listaArquivos;
        })
        .orderBy('temporada')
        .getValue();
    }, 50);
  }
}
