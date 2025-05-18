import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { INoticiasXml } from '../interfaces_types/datosXml.interface';

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
    } else if (error instanceof Error) {
      console.error('Error general:', error.message);
    } else {
      console.error('Error desconocido', error);
    }
    throw error;
  }
};

export default pedirDatosRSSCMLElPais;
