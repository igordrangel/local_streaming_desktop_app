import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
	DynamicFormTypeFieldEnum,
	FormAbstract,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService,
	KoalaFileInterface,
	KoalaLoaderService,
	KoalaQuestionService,
	KoalaRequestService
} from "ngx-koala";
import { videoTipoOptions } from "./video-tipo.options";
import { videoCategoriaOptions } from "./video-categoria.options";
import { LocalStreamingService } from "../../../core/local-streaming.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VideoTipoEnum } from "./enums/video-tipo.enum";
import { BehaviorSubject } from "rxjs";
import { KoalaDynamicFormShowFieldInterface } from "ngx-koala/lib/shared/components/form/dynamic-form/interfaces/koala.dynamic-form-show-field.interface";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";
import { VideoInterface } from "../video.interface";
import { koala } from "koala-utils";

@Component({
	templateUrl: 'dialog-form-envio-video.component.html'
})
export class DialogFormEnvioVideoComponent extends FormAbstract implements OnInit {
	public formVideo: FormGroup;
	public formVideoConfig: KoalaDynamicFormFieldInterface[];
	public showFields = new BehaviorSubject<KoalaDynamicFormShowFieldInterface[]>(null);
	
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
			valueChanges: async (tipo: VideoTipoEnum) => {
				if (!this.video) {
					this.showFields.next([
						{name: 'arquivo', show: false},
						{name: 'arquivos', show: false}
					]);
					await KlDelay.waitFor(5);
					if (tipo === VideoTipoEnum.filme) {
						this.showFields.next([{name: 'arquivo', show: true}]);
					} else {
						this.showFields.next([{name: 'arquivos', show: true}]);
					}
				}
			},
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
		}, {
			show: false,
			name: 'arquivo',
			type: DynamicFormTypeFieldEnum.file,
			class: 'col-12',
			fieldClass: 'w-100',
			fileButtonConfig: {
				accept: '.mp4, .mkv, .webm',
				text: 'Anexe seu Filme aqui!',
				icon: 'movie',
				color: "white",
				backgroundColor: "blue"
			},
			required: true
		}, {
			show: false,
			name: 'arquivos',
			type: DynamicFormTypeFieldEnum.file,
			class: 'col-12',
			fieldClass: 'w-100',
			multiple: true,
			fileButtonConfig: {
				accept: '.mp4, .mkv, .webm',
				text: 'Anexe seus episódios aqui!',
				icon: 'movie',
				color: "white",
				backgroundColor: "blue"
			},
			required: true
		}];
	}
	
	public async enviar() {
		this.loading(true);
		await this.requestService
		          .request(this.video?.id ?
			          this.localStreamingService.editar(this.video.id, this.prepararDadosEnvio()) :
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
		const data = this.dynamicFormService.emitData(this.formVideo) as any;
		if (!data.id) data.id = null;
		if (!this.video) {
			const klFiles = data.arquivo as KoalaFileInterface[];
			data.arquivos = klFiles.map(file => {
				file.filename = koala('')
					.string()
					.random(35, true, true, true)
					.concat(`.${file.filename.split('.')[1]}`)
					.getValue();
				
				return file;
			});
			delete data.arquivo;
		}
		return data;
	}
}
