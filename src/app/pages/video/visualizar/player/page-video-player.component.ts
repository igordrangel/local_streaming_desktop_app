import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoInterface } from '../../video.interface';
import { ActivatedRoute } from '@angular/router';
import { LocalStreamingService } from '../../../../core/local-streaming.service';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';
import { VideoTipoEnum } from '../../forms/enums/video-tipo.enum';
import { VideoArquivoInterface } from '../../video-arquivo.interface';
import { IpServer } from '../../../../shared/ip/ip-server';

@Component({
  templateUrl: 'page-video-player.component.html',
  styleUrls: ['page-video-player.component.css']
})
export class PageVideoPlayerComponent implements OnInit {
  public video$ = new BehaviorSubject<{
    video: VideoInterface;
    arquivo: VideoArquivoInterface;
  }>(null);
  public videoTipo = VideoTipoEnum;

  constructor(
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
}
