import { Component, OnInit } from "@angular/core";
import {
	DynamicFormTypeFieldEnum,
	KoalaDialogService,
	KoalaDynamicFormFieldInterface,
	KoalaDynamicFormService
} from "ngx-koala";
import { DialogFormEnvioVideoComponent } from "./forms/dialog-form-envio-video.component";
import { LocalStreamingService } from "../../core/local-streaming.service";
import { debounceTime, switchMap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { PosterInterface } from "./poster.interface";
import { VideoInterface } from "./video.interface";
import { VideoCategoriaEnumTranslate } from "./forms/enums/translate/video-categoria.enum.translate";
import { FormBuilder, FormGroup } from "@angular/forms";
import { videoTipoOptions } from "./forms/video-tipo.options";
import { videoCategoriaOptions } from "./forms/video-categoria.options";
import { VideoTipoEnum } from "./forms/enums/video-tipo.enum";
import { koala } from "koala-utils";

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
		private dialog: KoalaDialogService,
		private dynamicFormService: KoalaDynamicFormService,
		private localStreamingService: LocalStreamingService
	) {}
	
	ngOnInit() {
		this.formFilter = this.fb.group({});
		this.formFilterConfig = [{
			name: 'tipo',
			type: DynamicFormTypeFieldEnum.select,
			appearance: "legacy",
			class: 'col-2 mr-8',
			fieldClass: 'w-100',
			opcoesSelect: videoTipoOptions,
			value: VideoTipoEnum.filme,
			valueChanges: () => this.videos$ = this.getLista()
		}, {
			name: 'categoria',
			type: DynamicFormTypeFieldEnum.select,
			appearance: "legacy",
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
			class: 'col-6',
			fieldClass: 'w-100',
			valueChanges: () => this.videos$ = this.getLista().pipe(debounceTime(300))
		}];
		setTimeout(() => this.videos$ = this.getLista(), 1);
	}
	
	public dialogVideo(video?: VideoInterface) {
		this.dialog.open(
			DialogFormEnvioVideoComponent,
			'normal',
			video,
			'reloadList',
			() => this.videos$ = this.getLista()
		);
	}
	
	private getLista() {
		return this.localStreamingService
		           .getLista(this.dynamicFormService.emitData(this.formFilter))
		           .pipe(switchMap(videos => {
			           return new Observable<VideoInterface[]>(observe => {
				           videos.map(video => {
					           video.poster = new BehaviorSubject<PosterInterface>({
						           src: './assets/poster-default.jpg',
						           alt: 'Video de Teste'
					           });
				           });
				           observe.next(videos);
			           });
		           }));
	}
}
