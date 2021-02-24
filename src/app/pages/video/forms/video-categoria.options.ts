import { koala } from "koala-utils";
import { EnumTranslate } from "../../../core/enum.translate";
import { VideoCategoriaEnumTranslate } from "./enums/translate/video-categoria.enum.translate";
import { VideoCategoriaEnum } from "./enums/video-categoria.enum";

export const videoCategoriaOptions = koala([
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.acao),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.thriller),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.terror),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.suspense),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.fantasia),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.guerra),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.ficcaoCientifica),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.epico),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.documentario),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.comedia),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.anime),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.animacao),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.romance),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.musical),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.aventura),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.drama),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.crime),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.familia),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.faroeste),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.historia),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.kids),
  VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.realityShow)
]).array<EnumTranslate>().orderBy('name').getValue()
