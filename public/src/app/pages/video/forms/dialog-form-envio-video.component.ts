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
import { koala } from "koala-utils";
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
		}, {
			label: 'Video',
			name: 'arquivos',
			type: DynamicFormTypeFieldEnum.moreItems,
			moreItemsMinItems: 1,
			moreItemsMaxItems: 50000,
			moreItemsButtonIconAddlabel: 'Adicionar Video',
			moreItemsIcon: 'play_circle',
			moreItemsConfig: {
				form: this.fb.group({}),
				formConfig: [{
					name: 'id',
					type: DynamicFormTypeFieldEnum.id
				}, {
					label: 'Título',
					name: 'titulo',
					type: DynamicFormTypeFieldEnum.text,
					appearance: "outline",
					floatLabel: "always",
					class: 'col-6',
					fieldClass: 'w-100',
					required: true
				}, {
					label: 'Temporada (Caso seja Série)',
					name: 'temporada',
					type: DynamicFormTypeFieldEnum.number,
					appearance: "outline",
					floatLabel: "always",
					class: 'col-6',
					fieldClass: 'w-100',
					required: false
				}, {
					name: 'arquivo',
					type: DynamicFormTypeFieldEnum.file,
					class: 'col-6 text-center',
					fileButtonConfig: {
						accept: '.mp4, .mkv, .webm',
						text: 'Anexe seu Filme aqui!',
						icon: 'movie',
						color: "white",
						backgroundColor: "blue"
					},
					required: true
				}, {
					name: 'legenda',
					type: DynamicFormTypeFieldEnum.file,
					class: 'col-6 text-center',
					fileButtonConfig: {
						accept: '.srt',
						text: 'Anexe sua legenda aqui!',
						icon: 'movie',
						color: "white",
						backgroundColor: "blue"
					},
					required: false
				}],
				setValues: this.setValuesVideo
			}
		}];
		
		if (this.video) {
			const videos: KoalaDynamicSetValueInterface[][] = [];
			this.video.arquivos.forEach(arquivo => {
				videos.push([
					{name: 'id', value: arquivo.id},
					{name: 'titulo', value: arquivo.titulo},
					{name: 'temporada', value: arquivo.temporada}
				]);
			});
			this.dynamicFormService.setValuesInMoreItemsForm(this.setValuesVideo, videos);
		}
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
		const dataVideo = this.dynamicFormService.emitData(this.formVideo) as any;
		if (!dataVideo.id) dataVideo.id = null;
		const klFiles = dataVideo.arquivos as any[];
		const arquivos = klFiles.map(arquivoEnvio => {
			if (arquivoEnvio.arquivo) {
				const tmpVideoName = koala('')
					.string()
					.random(35, true, true, true)
					.getValue();
				const arquivo = arquivoEnvio.arquivo[0];
				arquivoEnvio.filename = koala(tmpVideoName)
					.string()
					.concat(`.${arquivo.filename.split('.')[1]}`)
					.getValue();
				arquivoEnvio.type = arquivo.type;
				arquivoEnvio.base64 = arquivo.base64;
				if (arquivoEnvio.legenda) {
					const legenda = arquivoEnvio.legenda[0];
					arquivoEnvio.legendaFilename = koala(tmpVideoName)
						.string()
						.concat(`.${legenda.legendaFilename.split('.')[1]}`)
						.getValue();
					arquivoEnvio.legendaBase64 = legenda.base64;
				}
			}
			delete arquivoEnvio.arquivo;
			delete arquivoEnvio.legenda;
			delete dataVideo.arquivos;
			arquivoEnvio.video = dataVideo;
			return arquivoEnvio;
		});
		return arquivos;
	}
}
