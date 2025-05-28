import { Request, Response } from 'express';
import logger from '../logger';
import { BuscarNoticiasNuevasService } from '../services/buscarNoticiasNuevas.services';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';

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
        : `Se actualizaron: ${data.resultado} noticias nuevas`,
      data.noticiasBorradas === 0
        ? 'No hay noticias antigüas'
        : `${data.noticiasBorradas} elementos desactualizados fueron eliminados `,
    ];

    return RespuestaAlFrontend(res, 200, false, resultado, respuesta);
  };

  public buscarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10

    const buscarNoticiasALaDBService = new BuscarNoticiasNuevasService();
    const noticias: IRespuestaData = await buscarNoticiasALaDBService.buscarNoticiasEnDB({page, limit})
    
    return RespuestaAlFrontend(res, 200, false, '', noticias)
  };

  public buscarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('buscar noticia por ID');
  };

  public buscarNoticiaPorPalabra = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('buscar noticia por palabra clave');
  };

  public eliminarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('eliminar noticia por su ID');
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
