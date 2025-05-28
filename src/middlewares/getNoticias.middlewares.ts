import { NextFunction, Request, Response } from 'express';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const validarQueryGetNoticias = (req: Request, res: Response, next: NextFunction) => {
  const pageQuery = req.query.page;
  const limitQuery = req.query.limit;

  if (pageQuery !== undefined) {
    const page = parseInt(pageQuery as string) || 1;
    if (isNaN(page) || page < 1) {
      logger.error('page incorrecto');
      throw new ClienteError('Page o Limit incorrectos', 404);
    }
  }

  if (limitQuery !== undefined) {
    const limit = parseInt(limitQuery as string) || 20;
    if (isNaN(limit) || limit < 0 || limit > 20) {      
      logger.error(  'limit incorrecto');
      throw new ClienteError('Page o Limit incorrectos', 404);
    }
  }

  next();
};

export default validarQueryGetNoticias;
