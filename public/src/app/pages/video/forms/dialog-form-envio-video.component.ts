import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
	DynamicFormTypeFieldEnum,
	FormAbstract,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService,
	KoalaDynamicSetValueInterface,
	KoalaLoaderService,
	KoalaQuestionService,
	KoalaRequestService
} from "ngx-koala";
import { videoTipoOptions } from "./video-tipo.options";
import { videoCategoriaOptions } from "./video-categoria.options";
import { LocalStreamingService } from "../../../core/local-streaming.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VideoInterface } from "../video.interface";
import { BehaviorSubject } from "rxjs";

@Component({
	templateUrl: 'dialog-form-envio-video.component.html'
})
export class DialogFormEnvioVideoComponent extends FormAbstract implements OnInit {
	public formVideo: FormGroup;
	public formVideoConfig: KoalaDynamicFormFieldInterface[];
	public setValuesVideo = new BehaviorSubject<BehaviorSubject<KoalaDynamicSetValueInterface[]>[]>([]);
	
	constructor(
		private fb: FormBuilder,
		private loaderService: KoalaLoaderService,
		private dynamicFormService: KoalaDynamicFormService,
		private localStreamingService: LocalStreamingService,
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
			name: 'id',
			type: DynamicFormTypeFieldEnum.id,
			value: this.video?.id ?? null
		}, {
			label: 'Título Original',
			name: 'tituloOriginal',
			type: DynamicFormTypeFieldEnum.text,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: true,
			value: this.video?.tituloOriginal
		}, {
			label: 'Título Nacional',
			name: 'titulo',
			type: DynamicFormTypeFieldEnum.text,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: false,
			value: this.video?.titulo
		}, {
			label: 'Tipo',
			name: 'tipo',
			type: DynamicFormTypeFieldEnum.select,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			opcoesSelect: videoTipoOptions,
			required: true,
			value: this.video?.tipo
		}, {
			label: 'Categoria',
			name: 'categoria',
			type: DynamicFormTypeFieldEnum.select,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			opcoesSelect: videoCategoriaOptions,
			required: true,
			value: this.video?.categoria
		}];
	}
	
	public async enviar() {
		this.loading(true);
		await this.requestService
		          .request(this.video?.id ?
			          this.localStreamingService.editar(this.prepararDadosEnvio()) :
			          this.localStreamingService.novoVideo(this.prepararDadosEnvio()),
			          () => {
				          this.dialogRef.close('reloadList');
				          this.loading(false);
			          }, () => this.loading(false));
	}
	
	public excluir() {
		this.questionService.open({
			message: 'Deseja mesmo excluir este vídeo?'
		}, async () => {
			this.loaderService.create({typeLoader: "indeterminate"});
			await this.requestService
			          .request(
				          this.localStreamingService.excluir(this.video.id),
				          () => {
					          this.dialogRef.close('reloadList');
					          this.loaderService.dismiss();
				          }, () => this.loaderService.dismiss());
		});
	}
	
	private prepararDadosEnvio() {
		return this.dynamicFormService.emitData(this.formVideo) as any;
	}
}
