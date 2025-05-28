import { Types } from 'mongoose';
import NoticiasModel from '../database/modelo_schema/noticias.modelo';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

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
    if (!page || !limit) throw new ClienteError('Error en los datos de paginación');

    if (page) {
      if (isNaN(page) || page < 1) {
        logger.error('page incorrecto');
        throw new ClienteError('Page o Limit incorrectos', 404);
      }
    }
    if (limit) {
      if (isNaN(limit) || limit < 0 || limit > 20) {
        logger.error('limit incorrecto');
        throw new ClienteError('Page o Limit incorrectos', 404);
      }
    }
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
  async buscarNoticiaPorId({id}: {id: string}): Promise<IDatosEnriquecidos | null> {

    if(!Types.ObjectId.isValid(id))  throw new ClienteError('Id de noticia no encontrado')
      
    const noticia: IDatosEnriquecidos | null = await NoticiasModel.findById({_id: id})
    return noticia;
  }
}

export default NoticiasRepository;
