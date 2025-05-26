import { Request, Response } from 'express';
import { BuscarNoticiasNuevasService } from '../services/buscarNoticiasNuevas.services';
// import RespuestaAlFrontend from '../utils/respuestaAlFrontend';
// import guardarNoticiasNuevasDB from '../services/guardarNoticiasNuevasDB.service';
import logger from '../logger';

class ActualizarNoticiasController {
  public cargarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url;
    const buscarNoticiasNuevasService = new BuscarNoticiasNuevasService();
    const json = await buscarNoticiasNuevasService.buscarNoticiasNuevas(url);
    // const respuesta = {
    //   page: 1,
    //   limit: 20,
    //   total: 1000,
    //   data: json
    // }
    // return RespuestaAlFrontend(res, 200, false, "", respuesta)
    res.status(200).json({ data: json });
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
    logger.error({datos, ms: ip}, "error inesperado")
    res.status(200).json({respuesta: "respuesta"});
  };
}

export default ActualizarNoticiasController;
