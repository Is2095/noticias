import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { ErrorClienteError } from '../interfaces_types/errorClienteError.type';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';
import routerNoticias from './noticias.routes';
import swaggerUI from 'swagger-ui-express'
import specs from '../swagger/swagger';

export const configuracionRutas = (app: Application): void => {
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('X-Total-Count', '1000');

    next();
  });

  app.use('/doc', swaggerUI.serve, swaggerUI.setup(specs))

  app.use('/', routerNoticias);
  app.use((err: ErrorClienteError, _req: Request, res: Response, _next: NextFunction) => {
    
    const statusCode = err.statusCode != null ? err.statusCode : 500;
    RespuestaAlFrontend(res, statusCode, true, err.message, null);
  });
};
