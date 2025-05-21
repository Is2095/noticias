import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import pedirDatosRSSCMLElPais from '../peticionesFetcheres/RSS_XML_Fetcher';
import enriquecerDatos from '../utils/enriquecerData';
import normalizarDatos from '../utils/normalizarData';

export class BuscarNoticiasNuevasService {
  public async buscarNoticiasNuevas(url: string): Promise<IDatosEnriquecidos[]> {
    const respuesta = await pedirDatosRSSCMLElPais(url);

    const respuestaNormalizada = normalizarDatos(respuesta);

    const respuestaEnriquecida = enriquecerDatos(respuestaNormalizada, url);

    return respuestaEnriquecida;
  }
}
