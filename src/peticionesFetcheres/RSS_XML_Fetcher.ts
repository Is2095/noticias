import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { INoticiasXml } from '../interfaces_types/datosXml.interface';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const pedirDatosRSSCMLElPais = async (url: string): Promise<INoticiasXml> => {
  const parser = new XMLParser();
  try {
    const { data } = await axios.get(url);
    const respuestaJson = parser.parse(data).rss;
    if (!respuestaJson) {
      throw new Error('No hay datos válidos para mostrar');
    }
    return respuestaJson as INoticiasXml;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', error.message);
      throw new ClienteError("Error inesperando al buscar la información -", 500)
    } else if (error instanceof Error) {
      console.error('Error general:', error.message);
      throw new ClienteError("Error inesperando al buscar la información", 500)
    } else {
      console.error('Error desconocido', error);
      throw new ClienteError("Error desconocido", 500)
    }
  }
};

export default pedirDatosRSSCMLElPais;
