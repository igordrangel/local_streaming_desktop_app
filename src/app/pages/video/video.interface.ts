import { VideoCategoriaEnum } from './forms/enums/video-categoria.enum';
import { VideoTipoEnum } from './forms/enums/video-tipo.enum';
import { VideoArquivoInterface } from './video-arquivo.interface';

export interface VideoInterface {
  id: number;
  tituloOriginal: string;
  titulo?: string;
  categoria: VideoCategoriaEnum;
  tipo: VideoTipoEnum;
  arquivos: VideoArquivoInterface[];
  poster?: string;
}
