import { Request, Response } from 'express';
import { BuscarNoticiasNuevasService } from '../services/buscarNoticiasNuevas.services';
import logger from '../logger';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';

class ActualizarNoticiasController {
  public cargarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url;
    const buscarNoticiasNuevasService = new BuscarNoticiasNuevasService();
    const data = await buscarNoticiasNuevasService.buscarNoticiasNuevas(url);
    const respuesta = {
      page: 1,
      limit: 20,
      total: 1000,
      data: null
    };
    const resultado = [ 
          data.resultado === 0
            ? 'Las noticias están actualizadas'
            : `Se actualizaron: ${data.resultado} noticias nuevas`,
          data.noticiasBorradas === 0
            ? 'No hay noticias antigúas'
            : `${data.noticiasBorradas} elementos desactualizados fueron eliminados `,
    ]
    
    return RespuestaAlFrontend(res, 200, false, resultado, respuesta);
  };

  public buscarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('buscar noticias nuevas');
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
