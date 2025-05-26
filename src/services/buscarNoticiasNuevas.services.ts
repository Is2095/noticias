// import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import logger from '../logger';
import pedirDatosRSSCMLElPais from '../peticionesFetcheres/RSS_XML_Fetcher';
import enriquecerDatos from '../utils/enriquecerData';
import normalizarDatos from '../utils/normalizarData';
import guardarNoticiasNuevasDB from './guardarNoticiasNuevasDB.service';

export class BuscarNoticiasNuevasService {
  
  public async buscarNoticiasNuevas(url: string): Promise<IDatosEnriquecidos[]> {

    logger.info('buscando noticias RSS XML');
    const respuesta = await pedirDatosRSSCMLElPais(url);
    
    logger.info('normalizando la información');
    const respuestaNormalizada = normalizarDatos(respuesta);
    
    logger.info('enriquesiendo la información');
    const respuestaEnriquecida = enriquecerDatos(respuestaNormalizada, url);
    
    const resultadoGuardadoNoticias = await guardarNoticiasNuevasDB(respuestaEnriquecida);

    return resultadoGuardadoNoticias;
  }
}
