import { IDatosNormalizados } from '../interfaces_types/datosNormalizados.interface';
import { INoticiasXml } from '../interfaces_types/datosXml.interface';

const normalizarDatos = (datos: INoticiasXml): IDatosNormalizados[] => {
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
};

export default normalizarDatos;
