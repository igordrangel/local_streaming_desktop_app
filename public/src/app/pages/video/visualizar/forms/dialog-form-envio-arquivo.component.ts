import { Component, Inject, OnInit } from "@angular/core";
import {
	DynamicFormTypeFieldEnum,
	FormAbstract,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService,
	KoalaLoaderService,
	KoalaQuestionService,
	KoalaRequestService
} from "ngx-koala";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VideoArquivoInterface } from "../../video-arquivo.interface";
import { LocalStreamingService } from "../../../../core/local-streaming.service";
import { koala } from "koala-utils";

@Component({
	templateUrl: 'dialog-form-envio-arquivo.component.html'
})
export class DialogFormEnvioArquivoComponent extends FormAbstract implements OnInit {
	public formArquivo: FormGroup;
	public formArquivoConfig: KoalaDynamicFormFieldInterface[];
	
	constructor(
		private fb: FormBuilder,
		private dynamicFormService: KoalaDynamicFormService,
		private requestService: KoalaRequestService,
		private localStreamingService: LocalStreamingService,
		private dialogRef: MatDialogRef<DialogFormEnvioArquivoComponent>,
		private question: KoalaQuestionService,
		private loaderService: KoalaLoaderService,
		@Inject(MAT_DIALOG_DATA) public data: {
			idVideo: number;
			arquivo: VideoArquivoInterface;
		}
	) {
		super(() => this.formArquivo);
	}
	
	ngOnInit() {
		this.formArquivo = this.fb.group({});
		this.formArquivoConfig = [{
			label: 'Nome',
			name: 'titulo',
			type: DynamicFormTypeFieldEnum.text,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: true,
			value: this.data.arquivo?.titulo
		}, {
			label: 'Temporada (Caso seja Série)',
			name: 'temporada',
			type: DynamicFormTypeFieldEnum.number,
			appearance: "outline",
			floatLabel: "always",
			class: 'col-6',
			fieldClass: 'w-100',
			required: false,
			value: this.data.arquivo?.temporada
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
		}]
	}
	
	public async enviar() {
		this.loading(true);
		const data = this.prepararDadosParaEnvio();
		await this.requestService
		          .request(this.data.arquivo ?
			          this.localStreamingService.editarArquivo(this.data.arquivo.id, data) :
			          this.localStreamingService.addArquivo(this.data.idVideo, data),
			          () => {
				          this.loading(false);
				          this.dialogRef.close('reload')
			          }, () => this.loading(false));
	}
	
	public excluir() {
		this.question.open({
			message: 'Deseja mesmo excluir este arquivo?'
		}, async () => {
			this.loaderService.create({typeLoader: "indeterminate"});
			await this.requestService
			          .request(
				          this.localStreamingService.deletarArquivo(this.data.arquivo.id),
				          () => {
					          this.loaderService.dismiss();
					          this.dialogRef.close('reload');
				          }, () => this.loaderService.dismiss());
		});
	}
	
	private prepararDadosParaEnvio() {
		const arquivoEnvio = this.dynamicFormService.emitData(this.formArquivo) as any;
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
		
		return arquivoEnvio;
	}
}
