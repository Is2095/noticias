import NoticiasModel from '../database/modelo_schema/noticias.modelo';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';

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
    return resultado.length;
  }
  async buscarNoticiasEnDB({ page, limit }: { page: number; limit: number }) {
    const data: IDatosEnriquecidos[] = await NoticiasModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NoticiasModel.countDocuments();
    const datos: IRespuestaData = {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      noticias: data,
    };
    return datos;
  }
}

export default NoticiasRepository;
