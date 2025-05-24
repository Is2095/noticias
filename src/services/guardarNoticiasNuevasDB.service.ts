import NoticiasModel from '../database/modelo_schema/noticias.modelo';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';

const guardarNoticiasNuevasDB = async (datosAGuardar: IDatosEnriquecidos[]) => {
  console.log('borrando noticias de un día de antigüedad');

  // borrado de noticias con un día de antigüedad
  const ahora = new Date();
  const haceUnDía = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  const borradoNoticiasAntiguas = await NoticiasModel.deleteMany({
    fechaYHoraIngestion: { $lt: haceUnDía },
  });

  if (borradoNoticiasAntiguas.deletedCount > 0) {
    console.log('Se borraron noticias antigüas: ', borradoNoticiasAntiguas.deletedCount);
  } else {
    console.log('No se encontraron noticias antigüas');
  }

  console.log('guardando ');

  // se obtienen el index de las noticiasa y se comparar con las nuevas para descartar noticias nuevas
  const combinacionesIndex = datosAGuardar.map((noticia) => ({
    tituloPais: noticia.tituloPais,
    titulo: noticia.titulo,
    enlaceNoticia: noticia.enlaceNoticia,
    fechaPublicacion: noticia.fechaPublicacion,
  }));

  const identificadoresExistentes = await NoticiasModel.find(
    {
      $or: combinacionesIndex,
    },
    { tituloPais: 1, titulo: 1, enlaceNoticia: 1, fechaPublicacion: 1 }
  ).lean();

  const existentesSet = new Set(
    identificadoresExistentes.map(
      (n) => `${n.tituloPais}|${n.titulo}|${n.enlaceNoticia}|${n.fechaPublicacion}`
    )
  );

  const noticiasFiltrasParaGuardar = datosAGuardar.filter((noticia) => {
    const clave = `${noticia.tituloPais}|${noticia.titulo}|${noticia.enlaceNoticia}|${noticia.fechaPublicacion}`;
    return !existentesSet.has(clave);
  });

  // filtradas las noticias se guardan en base de datos
  const resultado = [];
  for (const noticia of noticiasFiltrasParaGuardar) {
    const model = new NoticiasModel(noticia);
    const doc: IDatosEnriquecidos | null = await model.save();
    console.log('noticias guardadas en base de datos');
    resultado.push(doc);
  }
  return resultado;
};

export default guardarNoticiasNuevasDB;
