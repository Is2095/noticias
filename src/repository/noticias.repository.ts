import { FilterQuery, Types } from 'mongoose';
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

    const total = await this.contarNoticiasExistentes();
    // const total = await NoticiasModel.countDocuments();

    const datos: IRespuestaData = {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      noticias: data,
    };
    return datos;
  }
  async buscarNoticiasConFiltros({
    page,
    limit,
    titulo,
    fechaFrom,
    fechaTo,
  }: {
    page: number;
    limit: number;
    titulo: string;
    fechaFrom: Date;
    fechaTo: Date;
  }): Promise<IRespuestaData | null> {
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

    const filters: FilterQuery<IDatosEnriquecidos> = {};

    if (titulo) {
      if (typeof titulo === 'string') {
        if (/[$][\w]+|\.|[.*+?^${}()[\]|\\]/.test(titulo)) {
          logger.error('título inválid', titulo);
          throw new ClienteError('Palabra de búsqueda para título incorrecto', 404);
        }
        const regex = new RegExp(titulo, 'i');        

        filters.$or = [
          { seccionOCategoria: { $regex: regex } },
          { 'palabrasClaves.titulo': { $regex: regex } },
        ];
        
      }
    }
    if (fechaFrom || fechaTo) {
      const dateFilter: FilterQuery<IDatosEnriquecidos> = {};
      if (fechaFrom) {
        const fromDate = new Date(fechaFrom);
        if (isNaN(fromDate.getTime()))
          throw new ClienteError('Fecha inicial para la búsqueda incorrecta', 404);
        dateFilter.$gte = fromDate;
      }
      if (fechaTo) {
        const toDate = new Date(fechaTo);
        if (isNaN(toDate.getTime()))
          throw new ClienteError('Fecha límite para la búsqueda incorrecta', 404);
        dateFilter.$lte = toDate;
      }
      filters.fechaPublicacion = dateFilter;
    }

    console.dir(filters, { depth: null });
    
    const noticias: IDatosEnriquecidos[] | null = await NoticiasModel.find(filters)
      .skip((page - 1) * limit)
      .limit(limit);

    if (noticias) {
      const total = await this.contarNoticiasExistentes();

      const datos: IRespuestaData = {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        noticias: noticias,
      };
      return datos;
    }
    return null;
  }

  async buscarNoticiaPorId({ id }: { id: string }): Promise<IDatosEnriquecidos | null> {
    if (!Types.ObjectId.isValid(id)) throw new ClienteError('Id de noticia no encontrado');

    const noticia: IDatosEnriquecidos | null = await NoticiasModel.findById({ _id: id });
    return noticia;
  }
  async buscarYEliminarNoticiaPorIdEnDB({
    id,
  }: {
    id: string;
  }): Promise<IDatosEnriquecidos | null> {
    if (!Types.ObjectId.isValid(id)) throw new ClienteError('Id de noticia no encontrado');
    const eliminadoDeNoticiaPorId: IDatosEnriquecidos | null =
      await NoticiasModel.findByIdAndDelete({ _id: id });
    return eliminadoDeNoticiaPorId;
  }
  async contarNoticiasExistentes(): Promise<number> {
    const total = await NoticiasModel.countDocuments();
    return total;
  }
}

export default NoticiasRepository;
