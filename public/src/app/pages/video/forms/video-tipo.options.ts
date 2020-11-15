import { koala } from "koala-utils";
import { EnumTranslate } from "../../../core/enum.translate";
import { VideoTipoEnumTranslate } from "./enums/translate/video-tipo.enum.translate";
import { VideoTipoEnum } from "./enums/video-tipo.enum";

export const videoTipoOptions = koala([
	VideoTipoEnumTranslate.translate(VideoTipoEnum.filme),
	VideoTipoEnumTranslate.translate(VideoTipoEnum.serie)
]).array<EnumTranslate>().orderBy('name').getValue()
