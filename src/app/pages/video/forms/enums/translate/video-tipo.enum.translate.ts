import { EnumTranslate } from "../../../../../core/enum.translate";
import { VideoTipoEnum } from "../video-tipo.enum";

export class VideoTipoEnumTranslate {
	
	public static translate(tipo: VideoTipoEnum): EnumTranslate {
		const result = {
			value: tipo
		} as EnumTranslate;
		
		switch (tipo) {
			case VideoTipoEnum.filme:
				result.name = 'Filme';
				break;
			case VideoTipoEnum.serie:
				result.name = 'Série';
				break;
		}
		
		return result;
	}
}
