import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DynamicFormTypeFieldEnum,
  FormAbstract,
  KoalaDynamicFormFieldInterface,
  KoalaDynamicFormService,
  KoalaLoaderService,
  KoalaQuestionService,
  KoalaRequestService
} from 'ngx-koala';
import { videoTipoOptions } from './video-tipo.options';
import { videoCategoriaOptions } from './video-categoria.options';
import { LocalStreamingService } from '../../../core/local-streaming.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoInterface } from '../video.interface';
import { Router } from '@angular/router';
import { ImdbService } from '../../../shared/services/imdb/imdb.service';

@Component({
  templateUrl: 'dialog-form-envio-video.component.html'
})
export class DialogFormEnvioVideoComponent extends FormAbstract implements OnInit {
  public formVideo: FormGroup;
  public formVideoConfig: KoalaDynamicFormFieldInterface[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: KoalaLoaderService,
    private dynamicFormService: KoalaDynamicFormService,
    private localStreamingService: LocalStreamingService,
    private imdbService: ImdbService,
    private requestService: KoalaRequestService,
    private questionService: KoalaQuestionService,
    private dialogRef: MatDialogRef<DialogFormEnvioVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public video: VideoInterface
  ) {
    super(() => this.formVideo);
  }

  ngOnInit() {
    this.formVideo = this.fb.group({});
    this.formVideoConfig = [{
      label: 'Título Original',
      name: 'tituloOriginal',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-6',
      fieldClass: 'w-100',
      required: true,
      value: this.video?.tituloOriginal
    }, {
      label: 'Título Nacional',
      name: 'titulo',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-6',
      fieldClass: 'w-100',
      required: false,
      value: this.video?.titulo
    }, {
      label: 'Tipo',
      name: 'tipo',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-6',
      fieldClass: 'w-100',
      opcoesSelect: videoTipoOptions,
      required: true,
      value: this.video?.tipo
    }, {
      label: 'Categoria',
      name: 'categoria',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-6',
      fieldClass: 'w-100',
      opcoesSelect: videoCategoriaOptions,
      required: true,
      value: this.video?.categoria
    }];
  }

  public async enviar() {
    this.loading(true);
    const dados = await this.prepararDadosEnvio();
    await this.requestService
              .request(this.video?.id ?
                       this.localStreamingService.editar(this.video?.id, dados) :
                       this.localStreamingService.novoVideo(dados),
                () => {
                  this.dialogRef.close('reloadList');
                  this.loading(false);
                }, () => this.loading(false));
  }

  public excluir() {
    this.questionService.open({
      message: 'Deseja mesmo excluir este vídeo?'
    }, async () => {
      this.loaderService.create({typeLoader: 'indeterminate'});
      await this.requestService
                .request(
                  this.localStreamingService.excluir(this.video.id),
                  () => {
                    this.dialogRef.close('reloadList');
                    this.loaderService.dismiss();
                    this.router.navigate(['videos']);
                  }, () => this.loaderService.dismiss());
    });
  }

  private async prepararDadosEnvio() {
    const video = this.dynamicFormService.emitData(this.formVideo) as any;
    if (!this.video || !this.video?.poster || this.video?.poster === './assets/poster-default.jpg') {
      video.poster = await new Promise<string>((resolve, reject) => {
        this.imdbService
            .getPoster(video.tituloOriginal)
            .subscribe(
              poster => resolve(poster),
              () => resolve(null)
            )
      });
    }
    return video;
  }
}
