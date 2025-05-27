import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import logger from '../logger';
import NoticiasRepository from '../repository/noticias.repository';

const guardarNoticiasNuevasDB = async (datosAGuardar: IDatosEnriquecidos[]) => {
  const noticiasRepository = new NoticiasRepository();

  // borrado de noticias con un día de antigüedad
  const ahora = new Date();
  const haceUnDía = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  const borradoNoticiasAntiguas = await noticiasRepository.borrarNoticiasAntiguas(haceUnDía);
  const noticiasBorradas = borradoNoticiasAntiguas.deletedCount;

  logger.info(
    borradoNoticiasAntiguas.deletedCount > 0
      ? `Se borraron noticias antigüas: ${borradoNoticiasAntiguas.deletedCount}`
      : 'No se encontraron noticias antigüas'
  );

  // se obtienen los parámetros para hacer las combinaciones para la comparación con el Index
  const combinacionesIndex = datosAGuardar.map((noticia) => ({
    tituloPais: noticia.tituloPais,
    titulo: noticia.titulo,
    enlaceNoticia: noticia.enlaceNoticia,
    fechaPublicacion: noticia.fechaPublicacion,
  }));

  // se obtienen los Index existentes en base de datos
  const identificadoresExistentes =
    await noticiasRepository.obtenerIdentificadoresExistentes(combinacionesIndex);

  // se crea un Set todos los datos de los parámetros del Index
  const existentesSet = new Set(
    identificadoresExistentes.map(
      (n) => `${n.tituloPais}|${n.titulo}|${n.enlaceNoticia}|${n.fechaPublicacion}`
    )
  );

  // se filtran las noticias entrantes que no estén en el set
  const noticiasFiltrasParaGuardar = datosAGuardar.filter((noticia) => {
    const clave = `${noticia.tituloPais}|${noticia.titulo}|${noticia.enlaceNoticia}|${noticia.fechaPublicacion}`;
    return !existentesSet.has(clave);
  });

  logger.info(
    noticiasFiltrasParaGuardar.length === 0
      ? 'no hay noticias nuevas para guardar'
      : 'Guardando Las noticias nuevas'
  );

  // se guardan las noticias filtradas en base de datos
  const resultado = await noticiasRepository.guardarNoticias(noticiasFiltrasParaGuardar);
  if(resultado > 0) logger.info("Noticias nuevas guardas")

  return {resultado, noticiasBorradas};
};

export default guardarNoticiasNuevasDB;
