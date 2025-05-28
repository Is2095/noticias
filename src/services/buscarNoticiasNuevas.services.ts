import { IRespuestaData } from '../interfaces_types/respuestaData.interface';
import logger from '../logger';
import pedirDatosRSSCMLElPais from '../peticionesFetcheres/RSS_XML_Fetcher';
import NoticiasRepository from '../repository/noticias.repository';
import enriquecerDatos from '../utils/enriquecerData';
import normalizarDatos from '../utils/normalizarData';
import guardarNoticiasNuevasDB from './guardarNoticiasNuevasDB.service';

export interface ResultadoGuardado {
  resultado: number;
  noticiasBorradas: number;
}

export class BuscarNoticiasNuevasService {
  public async buscarNoticiasNuevas(url: string): Promise<ResultadoGuardado> {
    logger.info('buscando noticias RSS XML');
    const respuesta = await pedirDatosRSSCMLElPais(url);

    logger.info('normalizando la información');
    const respuestaNormalizada = normalizarDatos(respuesta);

    logger.info('enriquesiendo la información');
    const respuestaEnriquecida = enriquecerDatos(respuestaNormalizada, url);

    const resultadoGuardadoNoticias = await guardarNoticiasNuevasDB(respuestaEnriquecida);

    return resultadoGuardadoNoticias;
  }
  public async buscarNoticiasEnDB({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<IRespuestaData> {
    
    logger.info('Pidiendo data a la base de datos');
    const noticiasRepository = new NoticiasRepository();
    const datos: IRespuestaData = await noticiasRepository.buscarNoticiasEnDB({ page, limit });
    return datos;
  }
}
