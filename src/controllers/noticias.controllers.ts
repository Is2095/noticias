import { Request, Response } from 'express';

class NoticiasController {
  public buscarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    console.log("por acá");
    
    res.status(200).send('buscar noticias nuevas');
  };

  public buscarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('buscar noticia por ID');
  };

  public buscarNoticiaPorPalabra = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('buscar noticia por palabra clave');
  };

  public cargarNoticiasNuevas = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('cargar noticias nuevas');
  };

  public eliminarNoticiaPorId = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send('eliminar noticia por su ID');
  };
}

export default NoticiasController;
