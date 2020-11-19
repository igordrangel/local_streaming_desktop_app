import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
	DynamicFormTypeFieldEnum,
	FormAbstract,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService,
	KoalaRequestService
} from "ngx-koala";
import { videoTipoOptions } from "./video-tipo.options";
import { videoCategoriaOptions } from "./video-categoria.options";
import { LocalStreamingService } from "../../../core/local-streaming.service";
import { MatDialogRef } from "@angular/material/dialog";
import { VideoTipoEnum } from "./enums/video-tipo.enum";
import { BehaviorSubject } from "rxjs";
import { KoalaDynamicFormShowFieldInterface } from "ngx-koala/lib/shared/components/form/dynamic-form/interfaces/koala.dynamic-form-show-field.interface";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";

@Component({
	templateUrl: 'dialog-form-envio-video.component.html'
})
export class DialogFormEnvioVideoComponent extends FormAbstract implements OnInit {
	public formVideo: FormGroup;
	public formVideoConfig: KoalaDynamicFormFieldInterface[];
	public showFields = new BehaviorSubject<KoalaDynamicFormShowFieldInterface[]>(null);
	
	constructor(
		private fb: FormBuilder,
		private dynamicFormService: KoalaDynamicFormService,
		private localStreamingService: LocalStreamingService,
		private requestService: KoalaRequestService,
		private dialogRef: MatDialogRef<DialogFormEnvioVideoComponent>
	) {
		super(() => this.formVideo);
	}
	
	ngOnInit() {
		this.formVideo = this.fb.group({});
		this.formVideoConfig = [{
			label: 'Título Original',
			name: 'tituloOriginal',
			type: DynamicFormTypeFieldEnum.text,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: true
		}, {
			label: 'Título Nacional',
			name: 'titulo',
			type: DynamicFormTypeFieldEnum.text,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: false
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
			},
			required: true
		}, {
			label: 'Categoria',
			name: 'categoria',
			type: DynamicFormTypeFieldEnum.select,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			opcoesSelect: videoCategoriaOptions,
			required: true
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
		          .request(
			          this.localStreamingService.novoVideo(this.prepararDadosEnvio()),
			          () => {
				          this.dialogRef.close('reloadList');
				          this.loading(false);
			          }, () => this.loading(false));
	}
	
	private prepararDadosEnvio() {
		const data = this.dynamicFormService.emitData(this.formVideo) as any;
		data.arquivo = data.arquivo[0];
		return data;
	}
}
