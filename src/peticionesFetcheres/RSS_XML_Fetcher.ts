import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { INoticiasXml } from '../interfaces_types/datosXml.interface';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import logger from '../logger';
import env from '../config/manejo_VE';

const pedirDatosRSSCMLElPais = async (url: string): Promise<INoticiasXml> => {
  const parser = new XMLParser();
  
  // Valido la url enviada
  if(typeof url !== 'string' || !env.urlNoticiasXML.includes(url)) throw new ClienteError('Url no reconocida fe', 404)
  
  try {
    // Hago el pedido a la api
    const { data } = await axios.get(url);
    // convierto la información XML a json
    const respuestaJson = parser.parse(data).rss;
    if (!respuestaJson) {
      throw new Error('No hay datos válidos para mostrar');
    }
    return respuestaJson as INoticiasXml;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.message, 'Error de Axios:');
      throw new ClienteError("Error inesperando al buscar la información -", 500)
    } else if (error instanceof Error) {
      logger.error(error.message, 'Error general:');
      throw new ClienteError("Error inesperando al buscar la información", 500)
    } else {
      logger.error(error, 'Error desconocido' );
      throw new ClienteError("Error desconocido", 500)
    }
  }
};

export default pedirDatosRSSCMLElPais;
