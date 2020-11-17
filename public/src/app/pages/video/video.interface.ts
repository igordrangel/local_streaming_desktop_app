import { BehaviorSubject } from "rxjs";
import { PosterInterface } from "./poster.interface";
import { VideoCategoriaEnum } from "./forms/enums/video-categoria.enum";
import { VideoTipoEnum } from "./forms/enums/video-tipo.enum";

export interface VideoInterface {
	tituloOriginal: string;
	titulo?: string;
	categoria: VideoCategoriaEnum;
	tipo: VideoTipoEnum;
	arquivo: string;
	poster: BehaviorSubject<PosterInterface>;
}
