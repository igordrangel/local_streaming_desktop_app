import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoInterface } from '../video.interface';
import { LocalStreamingService } from '../../../core/local-streaming.service';
import { ActivatedRoute } from '@angular/router';
import { VideoTipoEnum } from '../forms/enums/video-tipo.enum';
import { VideoCategoriaEnumTranslate } from '../forms/enums/translate/video-categoria.enum.translate';
import { DialogFormEnvioVideoComponent } from '../forms/dialog-form-envio-video.component';
import { KoalaDialogService } from 'ngx-koala';
import { DialogFormEnvioArquivoComponent } from './forms/dialog-form-envio-arquivo.component';
import { VideoArquivoInterface } from '../video-arquivo.interface';
import { koala } from 'koala-utils';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';

interface ListaArquivos {
	temporada: number;
	arquivos: VideoArquivoInterface[];
}

@Component({
	templateUrl: 'video.component.html',
	styleUrls: ['video.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {
	public video$ = new BehaviorSubject<VideoInterface>(null);
	public videoTipo = VideoTipoEnum;
	public videoCategoriaTranslate = VideoCategoriaEnumTranslate;
  public playlist$ = new BehaviorSubject<ListaArquivos[]>([]);

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

	public getStatusEpisodio(index: number, temporada: number) {
    const temporadaCurrent = this.playlist$.getValue().find(item => !!item.arquivos.find(arquivo => arquivo.current === true)).temporada;

	  let indexCurrent = 0;
    for (let [indexArquivo, arquivo] of this.playlist$.getValue().find(item => item.temporada === temporada).arquivos.entries()) {
      if (arquivo.current) {
        indexCurrent = indexArquivo;
        break;
      }
    }

	  if (index === indexCurrent && temporada === temporadaCurrent) {
	    return {
	      label: 'Assistindo',
        icon: 'play_circle',
        cssClass: 'assistindo'
      };
    } else if (index < indexCurrent || temporada < temporadaCurrent) {
      return {
        label: 'Assistido',
        icon: 'check_circle',
        cssClass: 'assistido'
      };
    } else {
      return {
        label: 'Não Assistido',
        icon: 'stop',
        cssClass: 'naoAssistido'
      };
    }
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
    setTimeout(() => {
      this.playlist$.next(koala(this.video$.getValue()?.arquivos ?? [])
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
        .getValue());
    }, 50);
  }
}
