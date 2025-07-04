import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import NoticiasRepository from '../repository/noticias.repository';

const guardarNoticiasNuevasDB = async (datosAGuardar: IDatosEnriquecidos[]) => {

  if(datosAGuardar.length === 0) {
    logger.error("No hay datos para guardar")
    throw new ClienteError("Fallo en los datos a guardar", 404)
  }

  const noticiasRepository = new NoticiasRepository();

  // Variable que tendrá el parámetro de antigüedad de noticias viejas (en este caso 5 días)
  const ahora = new Date();
  const haceCincoDias = new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000);

  // Se borran las noticias viejas
  const borradoNoticiasAntiguas = await noticiasRepository.borrarNoticiasAntiguas(haceCincoDias);
  // Se recupera el dato de la cantidad de noticias borradas
  const noticiasBorradas = borradoNoticiasAntiguas.deletedCount;

  logger.info(
    borradoNoticiasAntiguas.deletedCount > 0
      ? `Se borraron noticias antigüas: ${borradoNoticiasAntiguas.deletedCount}`
      : 'No se encontraron noticias antigüas'
  );

  // Proceso de guardado de las noticias teniendo en cuenta de no repetir noticias

  // Se obtienen los parámetros para hacer las combinaciones para la comparación con el Index (búsqueda en base de datos indexadas)
  const combinacionesIndex = datosAGuardar.map((noticia) => ({
    tituloPais: noticia.tituloPais,
    titulo: noticia.titulo,
    enlaceNoticia: noticia.enlaceNoticia,
    fechaPublicacion: noticia.fechaPublicacion,
  }));

  // Se obtienen los Index existentes en base de datos (datos indexados en base de datos MongoDB)
  const identificadoresExistentes =
    await noticiasRepository.obtenerIdentificadoresExistentes(combinacionesIndex);

  // Se crea un Set todos los datos de los parámetros del Index
  const existentesSet = new Set(
    identificadoresExistentes.map(
      (n) => `${n.tituloPais}|${n.titulo}|${n.enlaceNoticia}|${new Date(n.fechaPublicacion).toISOString()}`
    )
  );

  // Se filtran las noticias entrantes que no estén en el set
  const noticiasFiltrasParaGuardar = datosAGuardar.filter((noticia) => {
    const clave = `${noticia.tituloPais}|${noticia.titulo}|${noticia.enlaceNoticia}|${new Date(noticia.fechaPublicacion).toISOString()}`;
    return !existentesSet.has(clave);
  });

  logger.info(
    noticiasFiltrasParaGuardar.length === 0
      ? 'no hay noticias nuevas para guardar'
      : 'Guardando Las noticias nuevas'
  );

  // Se guardan las noticias filtradas en base de datos (sólo las que no están repetidas)
  const resultado = await noticiasRepository.guardarNoticias(noticiasFiltrasParaGuardar);
  // Cuento las noticias existentes
  const totalNoticiasExistentes = await noticiasRepository.contarNoticiasExistentes()
  if(resultado > 0) logger.info("Noticias nuevas guardas")

    // Retorno resultado del guardado de las noticias, total de noticias existentes y la cantidad de noticias borradas
  return {resultado, totalNoticiasExistentes, noticiasBorradas};
};

export default guardarNoticiasNuevasDB;
