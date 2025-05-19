import { IDatosEnriquecidos } from './noticiasEnriquecidas.interface';

export interface IRespuestaData {
  page: number;
  limit: number;
  total: number;
  data: IDatosEnriquecidos[];
}
