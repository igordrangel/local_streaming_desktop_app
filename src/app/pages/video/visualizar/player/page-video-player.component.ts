import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoInterface } from '../../video.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStreamingService } from '../../../../core/local-streaming.service';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';
import { VideoArquivoInterface } from '../../video-arquivo.interface';
import { IpServer } from '../../../../shared/ip/ip-server';
import { FormControl } from '@angular/forms';
import { koala } from 'koala-utils';
import { ListaArquivos } from '../video.component';
import { VideoTipoEnum } from '../../forms/enums/video-tipo.enum';

@Component({
  templateUrl: 'page-video-player.component.html',
  styleUrls: ['page-video-player.component.css']
})
export class PageVideoPlayerComponent implements OnInit {
  public video$ = new BehaviorSubject<{
    video: VideoInterface;
    arquivo: VideoArquivoInterface;
  }>(null);
  public tipoVideo = VideoTipoEnum;
  public controlReproducaoAutomatica = new FormControl(false);
  private intervalTimerVideo: any;
  @ViewChild('videoEl', {static: false}) private videoEl: ElementRef<HTMLVideoElement>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStreamingService: LocalStreamingService
  ) {}

  ngOnInit() {
    this.activatedRoute
        .params
        .subscribe(async params => {
          const id = params.id;
          const idArquivo = parseInt(params.idArquivo);
          if (id && idArquivo) await this.loadVideo(id, idArquivo);
        });

    this.controlReproducaoAutomatica.valueChanges.subscribe(reproducaoAutomatica => this.setReproducaoAutomatica(reproducaoAutomatica));
  }

  public getUriVideo() {
    return `http://${IpServer.getIp()}:3000/video/${this.video$.getValue().video.id}/${this.video$.getValue().arquivo.filename}`;
  }

  public getUriSubtitle() {
    return `http://${IpServer.getIp()}:3000/video/${this.video$.getValue().video.id}/${this.video$.getValue().arquivo.legendaFilename.replace('.srt', '.vtt')}`;
  }

  private async loadVideo(id: number, idArquivo: number) {
    this.video$.next(null);
    await KlDelay.waitFor(50);
    this.localStreamingService
        .getPorId(id)
        .subscribe(video => {
          this.video$.next({
            video,
            arquivo: video.arquivos.find(arquivo => arquivo.id === idArquivo)
          });
        });
  }

  private setReproducaoAutomatica(active: boolean) {
    clearInterval(this.intervalTimerVideo);
    if (active) {
      this.intervalTimerVideo = setInterval(() => {
        const duration = this.videoEl.nativeElement.duration;
        const currentTime = this.videoEl.nativeElement.currentTime;

        if (duration === currentTime) {
          const playlist = this.getPlaylist();
          let indexCurrentTemporada = -1;
          let indexCurrentArquivo = -1;
          let indexNextTemporada = -1;
          let indexNextArquivo = -1;

          for (let [indexTemporada, itemTemporada] of playlist.entries()) {
            if (itemTemporada.temporada === this.video$.getValue().arquivo.temporada) {
              indexCurrentTemporada = indexTemporada;
              indexCurrentArquivo = koala(itemTemporada.arquivos).array().getIndex('id', this.video$.getValue().arquivo.id);

              if (playlist[indexCurrentTemporada].arquivos[indexCurrentArquivo + 1]) {
                indexNextTemporada = indexCurrentTemporada;
                indexNextArquivo = indexCurrentArquivo + 1;
              } else if (playlist[indexCurrentTemporada + 1]) {
                indexNextTemporada = indexCurrentTemporada + 1;
                indexNextArquivo = 0;
              }

              break;
            }
          }

          console.log(indexNextTemporada, indexNextArquivo);

          if (indexNextTemporada >= 0 && indexNextArquivo >= 0) {
            const video = this.video$.getValue().video;
            this.video$.next(null);
            setTimeout(() => {
              this.router.navigate(['video',video.id,'player',playlist[indexNextTemporada].arquivos[indexNextArquivo].id]).then();
              clearInterval(this.intervalTimerVideo);
              setTimeout(() => {
                this.videoEl.nativeElement.play().then();
                this.setReproducaoAutomatica(true);
              }, 300);
            }, 50);
          }
        }
      }, 1000);
    }
  }

  private getPlaylist() {
    return koala(this.video$.getValue()?.video.arquivos ?? [])
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
  }
}
