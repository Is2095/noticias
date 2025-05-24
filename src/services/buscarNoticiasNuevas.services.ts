// import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import pedirDatosRSSCMLElPais from '../peticionesFetcheres/RSS_XML_Fetcher';
import enriquecerDatos from '../utils/enriquecerData';
import normalizarDatos from '../utils/normalizarData';
import guardarNoticiasNuevasDB from './guardarNoticiasNuevasDB.service';

export class BuscarNoticiasNuevasService {
  
  public async buscarNoticiasNuevas(url: string): Promise<IDatosEnriquecidos[]> {

    console.log('buscando info');
    const respuesta = await pedirDatosRSSCMLElPais(url);
    
    console.log('normalizando info');
    const respuestaNormalizada = normalizarDatos(respuesta);
    
    console.log('enriquesiendo info');
    const respuestaEnriquecida = enriquecerDatos(respuestaNormalizada, url);
    
    console.log('guardando info');
    const resultadoGuardadoNoticias = await guardarNoticiasNuevasDB(respuestaEnriquecida);

    return resultadoGuardadoNoticias;
  }
}
