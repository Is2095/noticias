import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ErrorClienteError } from '../../interfaces_types/errorClienteError.type';
import logger from '../../logger';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const manejadorErroresGenerales = (fn: AsyncHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: ErrorClienteError) => {
      logger.error({error: error.message, status: error.statusCode}, "Error general")
      next(error);
    });
  };
};

export default manejadorErroresGenerales;
