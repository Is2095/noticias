import { NextFunction, Request, Response } from 'express';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import { Types } from 'mongoose';

const validarQueryGetNoticias = (req: Request, res: Response, next: NextFunction) => {
  const pageQuery = req.query.page;
  const limitQuery = req.query.limit;
  const {id} = req.params;

  if (pageQuery !== undefined) {
    const page = parseInt(pageQuery as string) || 1;
    if (isNaN(page)) {
      logger.error('page incorrecto');
      throw new ClienteError('Page o Limit incorrectos', 404);
    }
    if(page < 0) {
      logger.error("Dato de page inválido")
      throw new ClienteError('Valor de página no válida')
    }
  }

  if (limitQuery !== undefined) {
    const limit = parseInt(limitQuery as string) || 20;
    if (isNaN(limit)) {      
      logger.error(  'limit incorrecto');
      throw new ClienteError('Page o Limit incorrectos', 404);
    }
    if( limit < 0 || limit > 20) {
      logger.error('Número de noticias límite inválido')
      throw new ClienteError("Número límite de noticia por página no válido")
    }
  }

  if(id) {
    if(!Types.ObjectId.isValid(id)) {
      logger.error("Error de tipo de id ingresado")
      throw new ClienteError('Id de noticia no encontrado')
    }
  }

  next();
};

export default validarQueryGetNoticias;
