import { IDatosNormalizados } from '../interfaces_types/datosNormalizados.interface';
import { INoticiasXml } from '../interfaces_types/datosXml.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const normalizarDatos = (datos: INoticiasXml): IDatosNormalizados[] => {
  if ('channel' in datos) {
    if ('item' in datos.channel) {
      if (datos.channel.item.length !== 0) {
        const noticiasFiltradas = datos.channel.item.map((item) => {
          const contenido = Array.isArray(item['content:encoded'])
            ? item['content:encoded'][0]
            : item['content:encoded'];

          const imagenes =
            typeof contenido === 'string'
              ? Array.from(contenido.matchAll(/<img[^>]+src="([^"]+)"/g), (m) => m[1])
              : [];

          return {
            tituloPais: datos.channel.title,
            titulo: item.title,
            enlaceNoticia: item.link,
            descripcionNoticia: item.description,
            fechaPublicacion: item.pubDate,
            imagen: imagenes,
            seccionOCategoria: item.category,
          };
        });
        return noticiasFiltradas;
      } else {
        logger.error("El archivo con noticias está vacío")
        throw new ClienteError('No se puedieron recuperar noticias de la fuente', 404);
      }
    } else {
      logger.error("No existe el parámetro item")
      throw new ClienteError('No se puedieron recuperar noticias de la fuente', 404);
    }
  } else {
    logger.error("No existe el parámetro channel")
    throw new ClienteError('No se puedieron recuperar noticias de la fuente', 404);
  }

  // if ('channel' in datos || !('item' in datos.channel) || datos.channel.item.length === 0) {
  //   console.log('channel' in datos, 'channel');
  //   console.log('item' in datos.channel, 'item');
  //   console.log(datos.channel.item.length === 0, 'length');

  //   throw new ClienteError('No se puedieron recuperar noticias de la fuente', 404);
  // }
};

export default normalizarDatos;
