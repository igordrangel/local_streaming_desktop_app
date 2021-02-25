import { Component, OnInit } from '@angular/core';
import { DynamicFormTypeFieldEnum, KoalaDynamicFormFieldInterface, KoalaDynamicFormService } from 'ngx-koala';
import { LocalStreamingService } from '../../core/local-streaming.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VideoInterface } from './video.interface';
import { VideoCategoriaEnumTranslate } from './forms/enums/translate/video-categoria.enum.translate';
import { FormBuilder, FormGroup } from '@angular/forms';
import { videoTipoOptions } from './forms/video-tipo.options';
import { videoCategoriaOptions } from './forms/video-categoria.options';
import { VideoTipoEnum } from './forms/enums/video-tipo.enum';
import { koala } from 'koala-utils';
import { IpServer } from '../../shared/ip/ip-server';

@Component({
  templateUrl: 'page-videos.component.html',
  styleUrls: ['page-videos.component.css']
})
export class PageVideosComponent implements OnInit {
  public formFilter: FormGroup;
  public formFilterConfig: KoalaDynamicFormFieldInterface[];

  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public videos$: Observable<VideoInterface[]>;

  constructor(
    private fb: FormBuilder,
    private dynamicFormService: KoalaDynamicFormService,
    private localStreamingService: LocalStreamingService
  ) {
  }

  ngOnInit() {
    this.formFilter = this.fb.group({});
    this.formFilterConfig = [{
      name: 'tipo',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'legacy',
      class: 'col-2 mr-8',
      fieldClass: 'w-100',
      opcoesSelect: videoTipoOptions,
      value: VideoTipoEnum.filme,
      valueChanges: () => this.videos$ = this.getLista()
    }, {
      name: 'categoria',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'legacy',
      class: 'col-3 mr-8',
      fieldClass: 'w-100',
      opcoesSelect: koala([
        {name: 'Todos os gêneros', value: ''}
      ]).array<any>().merge(videoCategoriaOptions).getValue(),
      valueChanges: () => this.videos$ = this.getLista()
    }, {
      label: 'Busque por título',
      name: 'titulo',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'legacy',
      class: 'col-2',
      fieldClass: 'w-100',
      valueChanges: () => this.videos$ = this.getLista().pipe(debounceTime(300))
    }, {
      label: 'Informe o IP de sua rede interna',
      name: 'ip',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'legacy',
      class: 'col-4',
      fieldClass: 'w-100',
      value: IpServer.getIp(),
      valueChanges: (ip: string) => {
        IpServer.setIp(ip);
        this.videos$ = this.getLista().pipe(debounceTime(300));
      }
    }];
    setTimeout(() => this.videos$ = this.getLista(), 1);
  }

  private getLista() {
    return this.localStreamingService
               .getLista(
                 koala(this.dynamicFormService.emitData(this.formFilter))
                   .object()
                   .merge({
                     sort: 'e.id',
                     order: 'DESC',
                     page: 0,
                     limit: 100
                   })
                   .getValue()
               )
               .pipe(switchMap(videos => {
                 return new Observable<VideoInterface[]>(observe => {
                   videos.map(video => {
                     video.poster = video.poster ?? './assets/poster-default.jpg';
                   });
                   observe.next(videos);
                 });
               }));
  }
}
