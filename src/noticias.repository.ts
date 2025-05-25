import NoticiasModel from './database/modelo_schema/noticias.modelo';
import { IDatosEnriquecidos } from './interfaces_types/noticiasEnriquecidas.interface';

class NoticiasRepository {
  async borrarNoticiasAntiguas(fechaLimite: Date) {
    return await NoticiasModel.deleteMany({
      fechaYHoraIngestion: { $lt: fechaLimite },
    });
  }
  async obtenerIdentificadoresExistentes(filtrosIndex: Partial<IDatosEnriquecidos>[]) {
    return await NoticiasModel.find(
      { $or: filtrosIndex },
      { tituloPais: 1, titulo: 1, enlaceNoticia: 1, fechaPublicacion: 1 }
    ).lean();
  }
  async guardarNoticias(noticias: IDatosEnriquecidos[]) {
    const resultado = [];
    for (const noticia of noticias) {
      const model = new NoticiasModel(noticia);
      const doc = await model.save();
      resultado.push(doc);
    }
    return resultado;
  }
}

export default NoticiasRepository;
