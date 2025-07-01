import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import pedirDatosRSSCMLElPais from '../peticionesFetcheres/RSS_XML_Fetcher';
import NoticiasRepository from '../repository/noticias.repository';
import enriquecerDatos from '../utils/enriquecerData';
import normalizarDatos from '../utils/normalizarData';
import guardarNoticiasNuevasDB from './guardarNoticiasNuevasDB.service';

export interface ResultadoGuardado {
  resultado: number;
  noticiasBorradas: number;
  totalNoticiasExistentes: number;
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

    if (!page || !limit) throw new ClienteError('Error en los datos de paginación');

    const noticiasRepository = new NoticiasRepository();
    const datos: IRespuestaData = await noticiasRepository.buscarNoticiasEnDB({ page, limit });
    return datos;
  }

  public async buscarNoticiaPorFiltros({
    page,
    limit,
    titulo,
    fechaFrom,
    fechaTo,
  }: {
    page: number;
    limit: number;
    titulo: string;
    fechaFrom: Date;
    fechaTo: Date;
  }): Promise<IRespuestaData | null> {
    logger.info('Pidiendo data a la base de datos con filtros');
    const noticiasRepository = new NoticiasRepository();
    const data: IRespuestaData | null = await noticiasRepository.buscarNoticiasConFiltros({
      page,
      limit,
      titulo,
      fechaFrom,
      fechaTo,
    });
    return data;
  }

  public async buscarNoticiaPorId({ id }: { id: string }): Promise<IRespuestaData | null> {
    logger.info('Buscando noticia por id especíico');
    const noticiasRepository = new NoticiasRepository();

    const data: IDatosEnriquecidos | null = await noticiasRepository.buscarNoticiaPorId({ id });

    if (data) {
      const respuesta: IRespuestaData = {
        page: 1,
        limit: 1,
        total: 1,
        totalPage: 1,
        noticias: [data],
      };
      return respuesta;
    }
    return null;
  }
  public async eliminarNoticiaPorId({ id }: { id: string }): Promise<IRespuestaData | null> {
    logger.info('Eliminando noticia por id');
    const noticiasRepository = new NoticiasRepository();
    const data: IDatosEnriquecidos | null =
      await noticiasRepository.buscarYEliminarNoticiaPorIdEnDB({ id });
    if (data) {
      const respuesta: IRespuestaData = {
        page: 1,
        limit: 1,
        total: 1,
        totalPage: 1,
        noticias: [data],
      };
      return respuesta;
    }
    return null;
  }
}
