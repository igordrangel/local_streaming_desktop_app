import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
	DynamicFormTypeFieldEnum,
	FormAbstract,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService,
	KoalaLoaderService,
	KoalaQuestionService,
	KoalaRequestService
} from "ngx-koala";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VideoArquivoInterface } from "../../video-arquivo.interface";
import { LocalStreamingService } from "../../../../core/local-streaming.service";
import { koala } from "koala-utils";
import { MatStepper } from "@angular/material/stepper";
import { map } from "rxjs/operators";
import { HttpEventType } from "@angular/common/http";

@Component({
	templateUrl: 'dialog-form-envio-arquivo.component.html'
})
export class DialogFormEnvioArquivoComponent extends FormAbstract implements OnInit {
	public formFile: FormGroup;
	public progressFileSend: number;
	
	public formArquivo: FormGroup;
	public formArquivoConfig: KoalaDynamicFormFieldInterface[];
	
	@ViewChild('stepper', {static: true}) public stepperRef: MatStepper;
	
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
		this.formFile = this.fb.group({
			videoFile: ['', Validators.required],
			videoInfo: ['', Validators.required]
		});
		this.formFile
		    .get('videoFile')
		    .valueChanges
		    .subscribe(async (file?: File) => {
			    if (file) {
				    this.localStreamingService
				        .uploadVideo(file)
				        .pipe(
					        map((event: any) => {
						        switch (event.type) {
							        case HttpEventType.UploadProgress:
								        this.progressFileSend = Math.round(event.loaded * 100 / event.total);
								        break;
							        case HttpEventType.Response:
								        return event;
						        }
					        })
				        )
				        .subscribe((event: any) => {
					        if (event?.body) {
						        this.formFile.get('videoInfo').setValue(event.body.data);
						        this.stepperRef.next();
					        }
				        });
			    }
		    });
		
		this.formArquivo = this.fb.group({});
		this.formArquivoConfig = [{
			focus: !!this.data?.arquivo,
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
			name: 'legenda',
			type: DynamicFormTypeFieldEnum.file,
			class: 'col-12',
			fileButtonConfig: {
				accept: '.srt',
				text: 'Anexe sua legenda aqui!',
				icon: 'subtitles',
				color: "white",
				backgroundColor: "blue"
			},
			required: false
		}];
		
		if (this.data.arquivo) {
			setTimeout(() => this.stepperRef.next(), 300);
		}
	}
	
	public async enviar() {
		this.loading(true, 'Enviando vídeo, isto pode levar vários minutos...');
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
		
		const tmpVideoName = koala('')
			.string()
			.random(35, true, true, true)
			.getValue();
		
		const dataFormFile = this.formFile.getRawValue() as any;
		const videoFile = dataFormFile.videoFile as File;
		const videoInfo = dataFormFile.videoInfo;
		
		if (videoInfo) {
			const arrFilename = videoFile.name.split('.');
			arquivoEnvio.filename = koala(tmpVideoName)
				.string()
				.concat(`.${arrFilename[arrFilename.length - 1]}`)
				.getValue();
			arquivoEnvio.tmpFilename = videoInfo.filename;
			arquivoEnvio.type = videoInfo.type;
		}
		
		if (arquivoEnvio.legenda) {
			const legenda = arquivoEnvio.legenda[0];
			const arrFilenameLegenda = legenda.filename.split('.');
			arquivoEnvio.legendaFilename = koala(tmpVideoName)
				.string()
				.concat(`.${arrFilenameLegenda[arrFilenameLegenda.length - 1]}`)
				.getValue();
			arquivoEnvio.legendaBase64 = legenda.base64;
		}
		delete arquivoEnvio.arquivo;
		delete arquivoEnvio.legenda;
		if (!arquivoEnvio.temporada) delete arquivoEnvio.temporada;
		
		return arquivoEnvio;
	}
}
