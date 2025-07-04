import { Request, Response } from 'express';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import { BuscarNoticiasNuevasService } from '../services/buscarNoticiasNuevas.services';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';

class ActualizarNoticiasController {
  public cargarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    // recupero la url de la api para el pedido de las noticias
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
    // Se prepara RESULTADO, dependiendo que datos retorna
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
    // define la página y el límite de noticias por página, y se le da valores por default
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    //buscar las noticias (con page y limit)
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
    // Si por query viene fecha desde la transforma en Date y si no pone la fecha por default hoy al comienzo del día
    const fechaFrom = req.query.from
      ? new Date(req.query.from as string)
      : (() => {
          const d = new Date();
          d.setUTCHours(0, 0, 0, 0);
          return d;
        })();

    // Si por query viene fecha a la transforma en Date y si no pone la fecha por default un minuto antes de terminar el día
    const fechaTo = req.query.to
      ? new Date(req.query.to as string)
      : (() => {
          const d = new Date();
          d.setUTCHours(23, 59, 59, 999);
          return d;
        })();

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();

    // Envío los datos del filtro y paginado al servicio
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
    // Recupero el id enviado por params
    const { id } = req.params;

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    // Envío el id al service
    const noticia = await buscarNoticiasALaDBService.buscarNoticiaPorId({ id });
    if (noticia) return RespuestaAlFrontend(res, 200, false, '', noticia);
    RespuestaAlFrontend(res, 404, false, 'No existe la noticia solicitada', null);
  };

  public eliminarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    // Se recupera el id de la noticia a eliminar (viene por params)
    const { id } = req.params;
    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    // Se envía el id de la noticia a eliminar al service 
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
