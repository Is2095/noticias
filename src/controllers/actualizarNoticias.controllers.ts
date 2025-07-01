import { Request, Response } from 'express';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import { BuscarNoticiasNuevasService } from '../services/buscarNoticiasNuevas.services';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';

class ActualizarNoticiasController {
  public cargarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url;
    const buscarNoticiasNuevasService = new BuscarNoticiasNuevasService();
    const data = await buscarNoticiasNuevasService.buscarNoticiasNuevas(url);
    const respuesta = {
      page: 0,
      limit: 0,
      total: 0,
      totalPage: 0,
      noticias: null,
    };
    const resultado = [
      data.resultado === 0
        ? 'Las noticias están actualizadas'
        : `Se actualizaron: ${data.resultado} noticias nuevas, Total noticias existentes: ${data.totalNoticiasExistentes}`,
      data.noticiasBorradas === 0
        ? 'No hay noticias antigüas'
        : `${data.noticiasBorradas} elementos desactualizados fueron eliminados `,
    ];

    return RespuestaAlFrontend(res, 200, false, resultado, respuesta);
  };

  public buscarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    const noticias: IRespuestaData = await buscarNoticiasALaDBService.buscarNoticiasEnDB({
      page,
      limit,
    });

    return RespuestaAlFrontend(res, 200, false, '', noticias);
  };
  public buscarNoticiaPorPalabra = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const titulo = req.query.titulo ? String(req.query.titulo) : '';
    const fechaFrom = req.query.from
      ? new Date(req.query.fechaFrom as string)
      : (() => {
          const d = new Date();
          d.setUTCHours(0, 0, 0, 0);
          return d;
        })();
    const fechaTo = req.query.to
      ? new Date(req.query.to as string)
      : (() => {
          const d = new Date();
          d.setUTCHours(23, 59, 59, 999);
          return d;
        })();

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();

    const respuesta = await buscarNoticiasALaDBService.buscarNoticiaPorFiltros({
      page,
      limit,
      titulo,
      fechaFrom,
      fechaTo,
    });

    return RespuestaAlFrontend(res, 200, false, '', respuesta);
  };

  public buscarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    const noticia = await buscarNoticiasALaDBService.buscarNoticiaPorId({ id });
    if (noticia) return RespuestaAlFrontend(res, 200, false, '', noticia);
    RespuestaAlFrontend(res, 404, false, 'No existe la noticia solicitada', null);
  };

  public eliminarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    const borradoNoticiaPorId = await buscarNoticiasALaDBService.eliminarNoticiaPorId({ id });

    if (borradoNoticiaPorId === null || borradoNoticiaPorId?.noticias === undefined) {
      throw new ClienteError('Noticia no encontrada para ser borrada');
    }
    logger.info(borradoNoticiaPorId);
    RespuestaAlFrontend(res, 200, false, 'Noticia eliminada', borradoNoticiaPorId);
  };

  public pruebas = async (req: Request, res: Response): Promise<void> => {
    const datos = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // const respuesta = await guardarNoticiasNuevasDB(datos);
    logger.error({ datos, ms: ip }, 'error inesperado');
    res.status(200).json({ respuesta: 'respuesta' });
  };
}

export default ActualizarNoticiasController;
